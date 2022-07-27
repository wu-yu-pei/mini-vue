import { effect, isTraking } from '../effect';
import { isRef, proxyRefs, ref, unRef } from '../ref';

describe('ref test', () => {
  it('happy path', () => {
    let a = 1;
    const refA = ref(a);
    let cc = 0;
    effect(() => {
      cc = refA.value;
    });
    expect(refA.value).toBe(1);
    refA.value++;

    expect(cc).toBe(2);
  });

  it('isRef', () => {
    const a = 1;
    const refA = ref(a);
    expect(isRef(refA)).toBe(true);
  });

  it('unRef', () => {
    const a = 1;
    const refA = ref(a);
    expect(unRef(refA)).toBe(1);
  });

  it('proxyRefs', () => {
    const user = {
      age: ref(10),
      name: 'xiaoming',
    };
    const proxyUser = proxyRefs(user);
    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);
    expect(proxyUser.name).toBe('xiaoming');

    // proxyUser.age = 20;
    // expect(proxyUser.age).toBe(20);
    // expect(user.age.value).toBe(20);

    // proxyUser.age = ref(10);
    // expect(proxyUser.age).toBe(10);
    // expect(user.age.value).toBe(10);
  });
});
