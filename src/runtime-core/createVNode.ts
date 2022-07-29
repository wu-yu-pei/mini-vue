import { ShapeFlags } from '../shared/shapeFlags';

export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    el: null,
    shapeFlags: getShapeFlages(type),
  };
  // 添加flag
  if (typeof children === 'string') {
    vnode.shapeFlags = vnode.shapeFlags | ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vnode.shapeFlags = vnode.shapeFlags | ShapeFlags.ARRAY_CHILDREN;
  }

  return vnode;
}

function getShapeFlages(type) {
  return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
}
