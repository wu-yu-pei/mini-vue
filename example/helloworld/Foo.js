import { h } from '../../lib/mini-vue.esm.js';

const Foo = {
  setup(props) {
    console.log(props);
  },
  render() {
    return h('div', {}, 'Foo' + this.count);
  },
};

export default Foo;
