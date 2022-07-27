import { computed } from '../computed';
import { reactive } from '../reactive';

describe('computed', () => {
  it('happy path', () => {
    // 1. ref
    // 2. value
    // 3. 缓存
    const user = reactive({
      age: 1,
    });
    const age = computed(() => {
      return user.age;
    });
    expect(age.value).toBe(1);
  });

  it('should computed lazy', () => {
    const value = reactive({
      foo: 1,
    });
    const getter = jest.fn(() => {
      return value.foo;
    });

    const cValue = computed(getter);

    // lazy
    expect(getter).not.toHaveBeenCalled();
    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    cValue.value;

    expect(getter).toHaveBeenCalledTimes(1);
  });
});
