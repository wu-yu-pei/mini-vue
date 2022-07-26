import { reactive, isReactive, readonly, isProxy } from '../reactive';

describe('reactive', () => {
  it('happy path', () => {
    const origin = { foo: 1 };
    const now = reactive(origin);
    expect(now).not.toBe(origin);
    expect(now.foo).toBe(1);
    expect(isReactive(origin)).toBe(false);
    expect(isReactive(now)).toBe(true);
  });

  it('reactive deep', () => {
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
    const nPerson = reactive(oPerson);

    expect(isReactive(nPerson.firends[0])).toBe(true);
    expect(isReactive(nPerson.dog)).toBe(true);
    expect(isReactive(nPerson.firends)).toBe(true);
  });

  it('is Proxy', () => {
    const o = {
      name: 'wuyupei',
    };
    const n = reactive(o);
    const nTwo = readonly(o);
    expect(isProxy(n)).toBe(true);
    expect(isProxy(n)).toBe(true);
  });
});
