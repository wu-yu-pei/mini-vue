import { h, renderSlots } from '../../lib/mini-vue.esm.js';

const Foo = {
  setup(props, { emit }) {},
  render() {
    const foo = h('p', {}, 'foo');
    const age = 10;
    console.log(this.$slots);
    return h('div', {}, [
      renderSlots(this.$slots, 'header', { age }),
      foo,
      renderSlots(this.$slots, 'fotter'),
    ]);
  },
};

export default Foo;
