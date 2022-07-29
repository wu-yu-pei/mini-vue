import { h } from '../../lib/mini-vue.esm.js';
import Foo from './Foo.js';
window.self = null;
const App = {
  // .vue 文件会编译成这个样
  render() {
    window.self = this;
    return h(
      'div',
      {
        id: 'root',
        class: 'red',
        onClick() {
          console.log('click');
        },
      },
      // 'hi,mini-vue'
      // [h('p', { class: 'red' }, 'Hi'), h('p', { class: 'blue' }, 'mini-vue' + this.msg)]
      [h('div', { class: 'red' }, this.msg), h(Foo, { count: 1 })]
    );
  },
  setup() {
    return {
      msg: 'my-vue',
    };
  },
};

export default App;
