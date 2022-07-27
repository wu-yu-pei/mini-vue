import { hasChangeed, isObject } from '../shared';
import { isTraking, trackEffects, triggerEffects } from './effect';
import { reactive } from './reactive';

class RefImpl {
  private _value: any;
  dep: any;
  private _rawValue: any;
  public __v_isRef = true;
  constructor(value) {
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }

  get value() {
    // 收集依赖 抽离一下
    trackRefValue(this);

    return this._value;
  }

  set value(newValue) {
    // 触发依赖
    if (hasChangeed(newValue, this._rawValue)) {
      this._rawValue = newValue;
      this._value = convert(newValue);

      triggerEffects(this.dep);
    }
  }
}

function trackRefValue(ref) {
  if (isTraking()) {
    trackEffects(ref.dep);
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

export function ref(value) {
  return new RefImpl(value);
}

export function isRef(object) {
  return !!object.__v_isRef;
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      // 使用unref
      return unRef(Reflect.get(target, key));
    },
    set(target, key, value) {
      if (isRef(target[key] && !isRef(value))) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
}
