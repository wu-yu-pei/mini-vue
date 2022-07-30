import { h, createTextVNode, getCurrentInstance } from '../../lib/mini-vue.esm.js';
import Foo from './Foo.js';

const App = {
  name: 'app',
  setup() {
    const instance = getCurrentInstance();
    console.log('App', instance);
    return {};
  },
  render() {
    return h('div', {}, [h('p', {}, 'currentInstanceDemo'), h(Foo)]);
  },
};

export default App;
