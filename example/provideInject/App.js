import { h, provide, inject } from '../../lib/mini-vue.esm.js';

const Provide = {
  name: 'Provide',
  setup() {
    provide('foo', 'fooVal');
    provide('bar', 'barVal');
  },
  render() {
    return h('div', {}, [h('p', {}, 'Provide'), h(ProvideTwo)]);
  },
};

const ProvideTwo = {
  name: 'Provide',
  setup() {},
  render() {
    return h('div', {}, [h('p', {}, 'ProvideTwo'), h(Consume)]);
  },
};

const Consume = {
  name: 'Consume',
  setup() {
    const foo = inject('foo');
    const bar = inject('bar');
    const baz = inject('baz', () => 'defaultValue');
    return {
      foo,
      bar,
      baz,
    };
  },
  render() {
    console.log(this.foo);
    return h('div', {}, `Consume:-${this.foo}-${this.bar}-${this.baz}`);
  },
};

const App = {
  name: 'app',
  setup() {},
  render() {
    return h('div', {}, [h('p', {}, 'App'), h(Provide)]);
  },
};

export default App;
