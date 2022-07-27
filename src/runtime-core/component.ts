export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
  };

  return component;
}

export function setupComponent(instance) {
  // todo
  // init props
  // init slots

  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance) {
  const Component = instance.type;

  const { setup } = Component;

  if (setup) {
    // setup 结果  function||object
    const setupResult = setup();
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
