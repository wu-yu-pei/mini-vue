import { getCurrentInstance } from './component';

export function provide(key, val) {
  // 只能在setup中使用
  const currentInstance: any = getCurrentInstance();
  if (currentInstance) {
    let { provides, parent } = currentInstance;
    // 只执行一次 init
    if (provides === parent.provides) {
      provides = currentInstance.provides = Object.create(parent.provides);
    }

    provides[key] = val;
  }
}

export function inject(key, defaultvalue) {
  // 取
  const currentInstance: any = getCurrentInstance();
  if (currentInstance) {
    const parentProvides = currentInstance.parent.provides;

    if (key in parentProvides) {
      return parentProvides[key];
    } else if (defaultvalue) {
      if (typeof defaultvalue === 'function') {
        return defaultvalue();
      }
      return defaultvalue;
    }
  }
}
