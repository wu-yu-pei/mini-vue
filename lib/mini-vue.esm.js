const extend = Object.assign;
const isObject = (val) => {
    return val !== null && typeof val === 'object';
};
const isOn = (key) => /^on[A-Z]/.test(key);
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
// 驼峰转换
const camelize = (str) => {
    return str.replace(/-(\w)/, (_, c) => {
        return c ? c.toLocaleUpperCase() : '';
    });
};
// 首字母大写 add -> Add add-foo -> addFoo
const capitalize = (str) => {
    return str.charAt(0).toLocaleUpperCase() + str.slice(1);
};
// 转换为事件函数形式
const toHandlerKey = (str) => {
    return str ? 'on' + capitalize(camelize(str)) : '';
};

const Fragment = Symbol('Fragment');
const Text = Symbol('Text');
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
    if (vnode.shapeFlags & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        if (isObject(children)) {
            vnode.shapeFlags |= 16 /* ShapeFlags.SLOT_CHILDREN */;
        }
    }
    return vnode;
}
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}
function getShapeFlages(type) {
    return typeof type === 'string' ? 1 /* ShapeFlags.ELEMENT */ : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

const targetMap = new Map();
// 依赖收集
function track(target, key) {
    let deps = targetMap.get(target);
    if (!deps) {
        deps = new Map();
        targetMap.set(target, deps);
    }
    let dep = deps.get(key);
    if (!dep) {
        dep = new Set();
        deps.set(key, dep);
    }
}
// 依赖触发
function trigger(target, key) {
    const deps = targetMap.get(target);
    const dep = deps.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    for (const fn of dep) {
        if (fn.scheduler) {
            fn.scheduler();
        }
        else {
            fn.run();
        }
    }
}

function createGetter(isReadonly = false, shallowReadonly = false) {
    return function (target, key) {
        if (key === "__v-isReactive" /* ReactiveFlag.IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v-isReadonly" /* ReactiveFlag.IS_READONLY */) {
            return isReadonly;
        }
        const res = Reflect.get(target, key);
        if (shallowReadonly) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        if (!isReadonly) {
            // 收集依赖
            track(target, key);
        }
        return res;
    };
}
function createSetter() {
    return function (target, key, value) {
        const res = Reflect.set(target, key, value);
        // 触发依赖
        trigger(target, key);
        return res;
    };
}
// 优化：防止每创建一个 reactive对象就会会调用createGetter createSetter。
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonleyGet = createGetter(true, true);
const mutableHandlers = {
    get,
    set,
};
const readonlyHandlers = {
    get: readonlyGet,
    set: function (target, key, value) {
        console.warn(`target${key} is readonly`);
        return true;
    },
};
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonleyGet,
});

function reactive(obj) {
    return createActiveObject(obj, mutableHandlers);
}
function readonly(obj) {
    return createActiveObject(obj, readonlyHandlers);
}
function shallowReadonley(obj) {
    return createActiveObject(obj, shallowReadonlyHandlers);
}
function createActiveObject(obj, bashHandle) {
    if (!isObject(obj)) {
        console.log('不是一个对象');
        return obj;
    }
    return new Proxy(obj, bashHandle);
}

const emit = (instance, event, ...args) => {
    console.log('emit:', event);
    const { props } = instance;
    const handlerName = toHandlerKey(event);
    const handler = props[handlerName];
    handler && handler(...args);
};

function initProps(instance, props) {
    instance.props = props || {};
}

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots,
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

function initSlots(instance, children) {
    const { vnode } = instance;
    if (vnode.shapeFlags & 16 /* ShapeFlags.SLOT_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
}
function normalizeObjectSlots(children, slots) {
    for (const key in children) {
        const value = children[key];
        slots[key] = (props) => normalizeSlotValue(value(props));
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        emit: () => { },
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
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

function render(vnode, container) {
    // patch方法
    patch(vnode, container);
}
function patch(vnode, container) {
    const { shapeFlags, type } = vnode;
    switch (type) {
        case Fragment:
            processFragment(vnode, container);
            break;
        case Text:
            processText(vnode, container);
            break;
        default:
            // 优化为位运算 & 同为1才为1 | 同为0才为0
            if (shapeFlags & 1 /* ShapeFlags.ELEMENT */) {
                processElement(vnode, container);
            }
            else if (shapeFlags & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
                processComponent(vnode, container);
            }
            break;
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
// 处理Fragment
function processFragment(vnode, container) {
    mountChildren(vnode, container);
}
// 处理text
function processText(vnode, container) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
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

function renderSlots(slots, name, props) {
    const slot = slots[name];
    if (slot) {
        if (typeof slot === 'function') {
            return createVNode(Fragment, {}, slot(props));
        }
    }
}

export { createApp, createTextVNode, h, renderSlots };
