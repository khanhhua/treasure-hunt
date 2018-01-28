/* global AFRAME */
import './index.css';

const clues = require('./clues.json');

AFRAME.registerComponent('clues-component', {
  schema: {
  },
  init () {
    this.hudCamera = document.querySelector('#hudCamera');

    clues.forEach(clue => {
      const clueBox = document.createElement('a-entity');
      clueBox.setAttribute('position', clue.position);
      clueBox.setAttribute('clue-box', `message: "${clue.message}"`);

      this.el.appendChild(clueBox);
    });

    // setTimeout((_this) => {
    //   _this.openClueBox(_this.el.children[0].components['clue-box']);
    // }, 5000, this);
  },
  update () {

  },
  openClueBox (clueBox) {
    const message = clueBox.getMessage();
    const text = document.createElement('a-entity');
    text.setAttribute('position', '0 0.1 -0.5');
    text.setAttribute('text', `width: 1; align: center; color: #00f900; value: ${message}`);
    this.hudCamera.appendChild(text);
  }
});

AFRAME.registerComponent('clue-box', {
  schema: {
    message: {
      type: 'string'
    }
  },
  init () {
    const box = document.createElement('a-entity');
    box.setAttribute('geometry', `primitive:box;height:0.1;depth:0.1;width:0.1`);
    box.setAttribute('material', 'color:green;');
    this.el.appendChild(box);
  },
  update () {

  },
  getMessage () {
    return this.data.message;
  }
});
