import { reactive, isReactive } from '../reactive';

describe('reactive', () => {
  it('happy path', () => {
    const origin = { foo: 1 };
    const now = reactive(origin);
    expect(now).not.toBe(origin);
    expect(now.foo).toBe(1);
    expect(isReactive(origin)).toBe(false);
    expect(isReactive(now)).toBe(true);
  });
});
