import { effect } from '../effect';
import { isRef, ref, unRef } from '../ref';

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
});
