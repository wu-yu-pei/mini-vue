function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
    };
    return vnode;
}

function isObject(val) {
    return val !== null && typeof val === 'object';
}

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
    };
    return component;
}
function setupComponent(instance) {
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

function render(vnode, container) {
    // patch方法
    patch(vnode, container);
}
function patch(vnode, container) {
    if (typeof vnode.type === 'string') {
        // 1.processElement
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        // 2. 去处理组件
        processComponent(vnode, container);
    }
}
// 处理元素
function processElement(vnode, container) {
    mountElement(vnode, container);
}
// 处理组件
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountElement(vnode, container) {
    // 1.创建元素
    const el = document.createElement(vnode.type);
    // 2.处理子元素
    // 2.1 text
    const { children } = vnode;
    if (typeof children === 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(vnode, el);
    }
    // 处理props
    const { props } = vnode;
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, val);
    }
    // 挂载到容器
    container.append(el);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function mountChildren(vnode, container) {
    vnode.children.forEach((v) => {
        patch(v, container);
    });
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    // vnode
    // vnode --> element --> mount
    patch(subTree, container);
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 先转成vnode 后续所有的操作都是基于vnode
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
