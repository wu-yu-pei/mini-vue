import { isReadonly, readonly } from '../reactive';

describe('readonly', () => {
  it('readonly', () => {
    console.warn = jest.fn();

    const originObj = { foo: 1 };
    const nowObj = readonly(originObj);
    expect(nowObj).not.toBe(originObj);
    nowObj.foo = 2;
    expect(console.warn).toBeCalledTimes(1);
    expect(isReadonly(originObj)).toBe(false);
    expect(isReadonly(nowObj)).toBe(true);
  });
});
