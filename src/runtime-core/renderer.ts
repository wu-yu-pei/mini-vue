import { isOn } from '../shared/index';
import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from './component';
import { Fragment, Text } from './vnode';

export function render(vnode, container, parentComponent) {
  // patch方法
  patch(vnode, container, parentComponent);
}

function patch(vnode, container, parentComponent) {
  const { shapeFlags, type } = vnode;

  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentComponent);
      break;
    case Text:
      processText(vnode, container);
      break;
    default:
      // 优化为位运算 & 同为1才为1 | 同为0才为0
      if (shapeFlags & ShapeFlags.ELEMENT) {
        processElement(vnode, container, parentComponent);
      } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container, parentComponent);
      }
      break;
  }
}

// 处理元素
function processElement(vnode: any, container: any, parentComponent) {
  mountElement(vnode, container, parentComponent);
}

// 处理组件
function processComponent(vnode, container, parentComponent) {
  mountComponent(vnode, container, parentComponent);
}

// 处理Fragment
function processFragment(vnode: any, container: any, parentComponent) {
  mountChildren(vnode, container, parentComponent);
}

// 处理text
function processText(vnode: any, container: any) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));

  container.append(textNode);
}

function mountElement(vnode: any, container: any, parentComponent) {
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
    mountChildren(vnode, el, parentComponent);
  }

  // 处理props
  const { props } = vnode;
  for (const key in props) {
    const val = props[key];
    // 也可以使用正则
    if (isOn(key)) {
      const event = key.slice(2).toLocaleLowerCase();
      el.addEventListener(event, val);
    } else {
      el.setAttribute(key, val);
    }
  }

  // 挂载到容器
  container.append(el);
}

function mountComponent(initialVNode, container, parentComponent) {
  const instance = createComponentInstance(initialVNode, parentComponent);
  setupComponent(instance);
  setupRenderEffect(instance, initialVNode, container);
}

function mountChildren(vnode, container, parentComponent) {
  vnode.children.forEach((v) => {
    patch(v, container, parentComponent);
  });
}

function setupRenderEffect(instance, initialVNode, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);

  // vnode
  // vnode --> element --> mount
  patch(subTree, container, instance);

  initialVNode.el = subTree.el;
}
