class ReactiveEffect {
  private _fn: any;
  constructor(fn) {
    this._fn = fn;
  }

  run() {
    acctiveEffect = this;
    return this._fn();
  }
}

const targetMap = new Map();
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
}

export function trigger(target, key) {
  const deps = targetMap.get(target);
  const dep = deps.get(key);
  for (const fn of dep) {
    fn.run();
  }
}
let acctiveEffect;

export function effect(fn) {
  // 调用fn
  const _effect = new ReactiveEffect(fn);

  _effect.run();

  return _effect.run.bind(_effect);
}
