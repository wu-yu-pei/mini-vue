import { mutableHandlers, readonlyHandlers } from './basehandler';

export const enum ReactiveFlag {
  IS_REACTIVE = '__v-isReactive',
  IS_READONLY = '__v-isReadonly',
}

export function reactive(obj) {
  return createActiveObject(obj, mutableHandlers);
}

export function readonly(obj) {
  return createActiveObject(obj, readonlyHandlers);
}

export function isReactive(obj) {
  return !!obj[ReactiveFlag.IS_REACTIVE];
}

export function isReadonly(obj) {
  return !!obj[ReactiveFlag.IS_READONLY];
}

function createActiveObject(obj, bashHandle) {
  return new Proxy(obj, bashHandle);
}
