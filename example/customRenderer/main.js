import { createRenderer } from '../../lib/mini-vue.esm.js';
import App from './App.js';
const game = new PIXI.Application({
  width: 500,
  geight: 500,
});

document.body.append(game.view);

const render = createRenderer({
  createElement(type) {
    if (type === 'rect') {
      const rect = new PIXI.Graphics();
      rect.beginFill(0xff0000);
      rect.drawRect(0, 0, 100, 100);
      rect.endFill();
      return rect;
    }
  },
  patchProps(el, key, val) {
    el[key] = val;
  },
  insert(el, parent) {
    parent.addChild(el);
  },
});

render.createApp(App).mount(game.stage);
