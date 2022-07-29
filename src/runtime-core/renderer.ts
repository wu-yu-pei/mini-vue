import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from './component';

export function render(vnode, container) {
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
  if (shapeFlags & ShapeFlags.ELEMENT) {
    processElement(vnode, container);
  } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container);
  }
}

// 处理元素
function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}

// 处理组件
function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function mountElement(vnode: any, container: any) {
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
  if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
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
