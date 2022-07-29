function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null,
        shapeFlags: getShapeFlages(type),
    };
    // 添加flag
    if (typeof children === 'string') {
        vnode.shapeFlags = vnode.shapeFlags | 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlags = vnode.shapeFlags | 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    return vnode;
}
function getShapeFlages(type) {
    return typeof type === 'string' ? 1 /* ShapeFlags.ELEMENT */ : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

const isOn = (key) => /^on[A-Z]/.test(key);

const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        if (key === '$el') {
            return instance.vnode.el;
        }
    },
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
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
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
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
    const { shapeFlags } = vnode;
    // if (typeof vnode.type === 'string') {
    //   // 1.processElement
    //   processElement(vnode, container);
    // } else if (isObject(vnode.type)) {
    //   // 2. 去处理组件
    //   processComponent(vnode, container);
    // }
    // 优化为位运算 & 同为1才为1 | 同为0才为0
    if (shapeFlags & 1 /* ShapeFlags.ELEMENT */) {
        processElement(vnode, container);
    }
    else if (shapeFlags & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
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
    const el = (vnode.el = document.createElement(vnode.type));
    // 2.处理子元素
    // 2.1 text
    // const { children } = vnode;
    // if (typeof children === 'string') {
    //   el.textContent = children;
    // } else if (Array.isArray(children)) {
    //   mountChildren(vnode, el);
    // }
    // 优化为位运算
    const { children, shapeFlags } = vnode;
    if (shapeFlags & 4 /* ShapeFlags.TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlags & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
        mountChildren(vnode, el);
    }
    // 处理props
    const { props } = vnode;
    for (const key in props) {
        const val = props[key];
        // 也可以使用正则
        if (isOn(key)) {
            const event = key.slice(2).toLocaleLowerCase();
            el.addEventListener(event, val);
        }
        else {
            el.setAttribute(key, val);
        }
    }
    // 挂载到容器
    container.append(el);
}
function mountComponent(initialVNode, container) {
    const instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function mountChildren(vnode, container) {
    vnode.children.forEach((v) => {
        patch(v, container);
    });
}
function setupRenderEffect(instance, initialVNode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    // vnode
    // vnode --> element --> mount
    patch(subTree, container);
    initialVNode.el = subTree.el;
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
