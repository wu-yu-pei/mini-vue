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
  
  it('readonly deep', () => {
    const oPerson = {
      name: 'wuyupei',
      firends: [
        {
          name: 'liuxu',
        },
      ],
      dog: {
        name: 'xiaobai',
      },
    };

    const nPerson = readonly(oPerson);

    expect(isReadonly(nPerson)).toBe(true);
    expect(isReadonly(nPerson.firends[0])).toBe(true);
    expect(isReadonly(nPerson.dog)).toBe(true);
  });
});
