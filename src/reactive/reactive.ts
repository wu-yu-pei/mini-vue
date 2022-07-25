import { mutableHandlers, readonlyHandlers } from './basehandler';

export function reactive(obj) {
  return createActiveObject(obj, mutableHandlers);
}

export function readonly(obj) {
  return createActiveObject(obj, readonlyHandlers);
}

function createActiveObject(obj, bashHandle) {
  return new Proxy(obj, bashHandle);
}
