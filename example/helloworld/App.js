import { h } from '../../lib/mini-vue.esm.js';
console.log(111);
const App = {
  // .vue 文件会编译成这个样
  render() {
    return h('div', 'Hi,' + this.msg);
  },
  setup() {
    return {
      msg: 'my-vue',
    };
  },
};

export default App;
