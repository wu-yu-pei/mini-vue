import { h } from '../../lib/mini-vue.esm.js';

const App = {
  // .vue 文件会编译成这个样
  render() {
    return h(
      'div',
      {
        id: 'root',
        class: 'red',
      },
      // 'hi,mini-vue'
      [h('p', { class: 'red' }, 'Hi'), h('p', { class: 'blue' }, 'mini-vue')]
    );
  },
  setup() {
    return {
      msg: 'my-vue',
    };
  },
};

export default App;
