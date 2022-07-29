import { h } from '../../lib/mini-vue.esm.js';
import Foo from './Foo.js';

const App = {
  // .vue 文件会编译成这个样
  render() {
    // emit()
    return h('div', {}, [
      h('div', {}, 'App'),
      h(Foo, {
        onAdd(a, b) {
          console.log('接收到了', a, b);
        },
        onAddFoo(a, b) {
          console.log(a, b);
        },
      }),
    ]);
  },
  setup() {
    return {};
  },
};

export default App;
