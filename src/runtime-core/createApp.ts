import { createVNode } from './vnode';

export function createAppApi(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainer) {
        // 先转成vnode 后续所有的操作都是基于vnode
        const vnode = createVNode(rootComponent);

        render(vnode, rootContainer);
      },
    };
  };
}
