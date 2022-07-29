export const extend = Object.assign;

export const isObject = (val) => {
  return val !== null && typeof val === 'object';
};

export const hasChangeed = (val, newVal) => {
  return !Object.is(val, newVal);
};

export const isOn = (key: string) => /^on[A-Z]/.test(key);

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);

// 驼峰转换
export const camelize = (str: string) => {
  return str.replace(/-(\w)/, (_, c: string) => {
    return c ? c.toLocaleUpperCase() : '';
  });
};

// 首字母大写 add -> Add add-foo -> addFoo
export const capitalize = (str: string) => {
  return str.charAt(0).toLocaleUpperCase() + str.slice(1);
};

// 转换为事件函数形式
export const toHandlerKey = (str: string) => {
  return str ? 'on' + capitalize(camelize(str)) : '';
};
