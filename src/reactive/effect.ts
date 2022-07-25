class ReactiveEffect {
  private _fn: any;
  public scheduler: any;
  public deps = [];
  constructor(fn, scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler;
  }

  run() {
    acctiveEffect = this;
    return this._fn();
  }

  stop() {
    this.deps.forEach((dep: any) => {
      dep.delete(this);
    });
  }
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
  dep.add(acctiveEffect);
  // todo 好像有一个bug
  acctiveEffect && acctiveEffect.deps.push(dep);
}

// 依赖触发
export function trigger(target, key) {
  const deps = targetMap.get(target);
  const dep = deps.get(key);

  for (const fn of dep) {
    if (fn.scheduler) {
      fn.scheduler();
    } else {
      fn.run();
    }
  }
}
let acctiveEffect;

export function stop(runner) {
  runner.effect.stop();
}
// effect函数
export function effect(fn, options: any = {}) {
  // 调用fn
  const _effect = new ReactiveEffect(fn, options.scheduler);

  _effect.run();

  const runner: any = _effect.run.bind(_effect);

  runner.effect = _effect;

  return runner;
}
