import { isObject } from '../shared/index';
import { createComponentInstance, setupComponent } from './component';

export function render(vnode, container) {
  // patch方法
  patch(vnode, container);
}

function patch(vnode, container) {
  if (typeof vnode.type === 'string') {
    // 1.processElement
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    // 2. 去处理组件
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
  const el = document.createElement(vnode.type);

  // 2.处理子元素
  // 2.1 text
  const { children } = vnode;
  if (typeof children === 'string') {
    el.textContent = children;
  } else if (Array.isArray(children)) {
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
