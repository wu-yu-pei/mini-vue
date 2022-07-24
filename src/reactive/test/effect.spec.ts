import { reactive } from '../reactive';
import { effect } from '../effect';

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      name: 'wuyupei',
      age: 10,
    });

    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });

    expect(nextAge).toBe(11);

    user.age++;

    expect(nextAge).toBe(12);
  });

  it('shoule return runner when call effect', () => {
    let foo = 1;
    const runner = effect(() => {
      foo++;
      return 'foo';
    });
    expect(foo).toBe(2);
    const r = runner();
    expect(foo).toBe(3);
    expect(r).toBe('foo');
  });
});
