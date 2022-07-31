import { createRender } from '../runtime-core';
import { isOn } from '../shared';

export function createElement(type) {
  return document.createElement(type);
}

export function patchProps(el, key, val) {
  // 也可以使用正则;
  if (isOn(key)) {
    const event = key.slice(2).toLocaleLowerCase();
    el.addEventListener(event, val);
  } else {
    el.setAttribute(key, val);
  }
}

export function insert(el, parent) {
  parent.append(el);
}

const renderer:any = createRender({ createElement, patchProps, insert });

export function createApp(...args) {
  return renderer.createApp(...args);
}

export * from '../runtime-core';
