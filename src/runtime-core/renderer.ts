import { isOn } from '../shared/index';
import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from './component';
import { Fragment, Text } from './vnode';

export function render(vnode, container) {
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
      if (shapeFlags & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
      } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container);
      }
      break;
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

// 处理Fragment
function processFragment(vnode: any, container: any) {
  mountChildren(vnode, container);
}

// 处理text
function processText(vnode: any, container: any) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));

  container.append(textNode);
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
