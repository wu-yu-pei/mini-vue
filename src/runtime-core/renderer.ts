import { createComponentInstance, setupComponent } from './component';

export function render(vnode, container) {
  // patch方法
  patch(vnode, container);
}

function patch(vnode, container) {
  // 1. 去处理组件
  processComponent(vnode, container);
}

function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance, container) {
  const subTree = instance.render();

  // vnode
  // vnode --> element --> mount
  patch(subTree, container);
}
