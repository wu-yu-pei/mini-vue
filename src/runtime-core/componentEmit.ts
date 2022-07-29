import { toHandlerKey } from '../shared/index';

export const emit = (instance, event, ...args) => {
  console.log('emit:', event);

  const { props } = instance;

  const handlerName = toHandlerKey(event);

  const handler = props[handlerName];

  handler && handler(...args);
};
