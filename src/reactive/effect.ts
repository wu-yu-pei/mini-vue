import { extend } from '../shared';

let acctiveEffect;
let shouldTrack;

export class ReactiveEffect {
  private _fn: any;
  public scheduler: any;
  deps = [];
  active = true;
  onStop?: () => void;
  constructor(fn, scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler;
  }

  run() {
    if (!this.active) {
      return this._fn();
    }
    shouldTrack = true;
    acctiveEffect = this;
    const result = this._fn();
    shouldTrack = false;
    return result;
  }

  stop() {
    if (this.active) {
      clearUpEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

// 清楚effect
function clearUpEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
}

const targetMap = new Map();
// 依赖收集
export function track(target, key) {
  let deps = targetMap.get(target);
  if (!deps) {
    deps = new Map();
    targetMap.set(target, deps);
  }

  let dep = deps.get(key);
  if (!dep) {
    dep = new Set();
    deps.set(key, dep);
  }
  trackEffects(dep);
}

export function trackEffects(dep) {
  if (!acctiveEffect) return;
  dep.add(acctiveEffect);

  acctiveEffect.deps.push(dep);
}

// 依赖触发
export function trigger(target, key) {
  const deps = targetMap.get(target);
  const dep = deps.get(key);

  triggerEffects(dep);
}

export function triggerEffects(dep) {
  for (const fn of dep) {
    if (fn.scheduler) {
      fn.scheduler();
    } else {
      fn.run();
    }
  }
}

export function stop(runner) {
  runner.effect.stop();
}

export function isTraking() {
  return shouldTrack && acctiveEffect !== undefined;
}
// effect函数
export function effect(fn, options: any = {}) {
  // 调用fn
  const _effect = new ReactiveEffect(fn, options.scheduler);

  // 优化
  // _effect.onStop = options.onStop;
  extend(_effect, options);

  _effect.run();

  const runner: any = _effect.run.bind(_effect);

  runner.effect = _effect;

  return runner;
}
