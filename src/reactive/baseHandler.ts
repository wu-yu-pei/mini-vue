import { isObject } from '../shared';
import { extend } from '../shared/index';
import { track, trigger } from './effect';
import { reactive, ReactiveFlag, readonly } from './reactive';

function createGetter(isReadonly = false, shallowReadonly = false) {
  return function (target, key) {
    if (key === ReactiveFlag.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlag.IS_READONLY) {
      return isReadonly;
    }

    const res = Reflect.get(target, key);

    if (shallowReadonly) {
      return res;
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    if (!isReadonly) {
      // 收集依赖
      track(target, key);
    }
    return res;
  };
}

function createSetter() {
  return function (target, key, value) {
    const res = Reflect.set(target, key, value);
    // 触发依赖
    trigger(target, key);
    return res;
  };
}

// 优化：防止每创建一个 reactive对象就会会调用createGetter createSetter。
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonleyGet = createGetter(true, true);

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set: function (target, key, value) {
    console.warn(`target${key} is readonly`);

    return true;
  },
};

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonleyGet,
});
