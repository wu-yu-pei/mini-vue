export const extend = Object.assign;

export const isObject = (val) => {
  return val !== null && typeof val === 'object';
};

export const hasChangeed = (val, newVal) => {
  return !Object.is(val, newVal);
};

export const isOn = (key: string) => /^on[A-Z]/.test(key);
