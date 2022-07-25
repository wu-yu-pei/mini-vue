import { reactive } from '../reactive';
import { effect, stop } from '../effect';

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

  it('effect scheduler', () => {
    // 1.effect的第二个参数给定的一个scheduler的数据
    // 2.当effect第一次执行的时候，还会执行发你
    // 3.当响应式对象发生set时， 不会执行fn 而是去执行 scheduler
    // 如果当执行runner的时候， 才会去执行fn
    let dumy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dumy = obj.foo;
      },
      { scheduler }
    );

    expect(scheduler).not.toHaveBeenCalled();
    expect(dumy).toBe(1);
    obj.foo++;
    expect(dumy).toBe(1);
    run();
    expect(dumy).toBe(2);
  });

  it('stop', () => {
    let dumy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dumy = obj.prop;
    });
    obj.prop = 2;
    expect(dumy).toBe(2);
    stop(runner);
    obj.prop = 3;
    expect(dumy).toBe(2);

    runner();
    expect(dumy).toBe(3);
  });
});
