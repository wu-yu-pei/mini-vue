import { shallowReadonley } from '../reactive/reactive';
import { emit } from './componentEmit';
import { initProps } from './componentProps';
import { PublicInstanceProxyHandlers } from './componentPublicInstance';
import { initSlots } from './componentSlots';

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    emit: () => {},
  };

  component.emit = emit.bind(null, component) as any;

  return component;
}

export function setupComponent(instance) {
  // todo
  // init props
  initProps(instance, instance.vnode.props);

  // init slots
  initSlots(instance, instance.vnode.children);

  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance) {
  const Component = instance.type;

  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);

  const { setup } = Component;

  if (setup) {
    // setup 结果  function||object
    const setupResult = setup(shallowReadonley(instance.props), { emit: instance.emit });
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult) {
  // function ojbect
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult;
  }

  // finish
  finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
  const Component = instance.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}
