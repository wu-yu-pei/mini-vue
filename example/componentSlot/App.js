import { h } from '../../lib/mini-vue.esm.js';
import Foo from './Foo.js';

const App = {
  name: 'app',
  setup() {
    return {};
  },
  render() {
    const app = h('div', {}, 'App');
    // 1.普通插槽
    // 2.多个插槽
    // 3.剧名插槽
    // const foo = h(Foo, {}, [h('p', {}, 'aaa'), h('p', {}, 'bbb ')]);
    // const foo = h(Foo, {}, h('p', {}, 'aaa'));
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => h('p', {}, 'header' + age),
        fotter: () => h('p', {}, 'fotter'),
      }
    );
    return h('div', {}, [app, foo]);
  },
};

export default App;
