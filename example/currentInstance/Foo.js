import { h, renderSlots, getCurrentInstance } from '../../lib/mini-vue.esm.js';

const Foo = {
  name: 'foo',
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    console.log('foo', instance);
  },
  render() {
    return h('div', {}, 'foo');
  },
};

export default Foo;
