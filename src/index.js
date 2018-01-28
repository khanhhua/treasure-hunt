/* global AFRAME */
import './index.css';

const clues = require('./clues.json');

AFRAME.registerComponent('clues-component', {
  schema: {
  },
  init () {
    this.hud = document.querySelector('#hud');

    clues.forEach(clue => {
      const clueBox = document.createElement('a-entity');
      clueBox.setAttribute('position', clue.position);
      clueBox.setAttribute('clue-box', `message: "${clue.message}"`);

      this.el.appendChild(clueBox);
    });
  },
  update () {

  },
  openClueBox (clueBox) {
    Array.from(this.hud.children).forEach(item => item.remove());

    const message = clueBox.getMessage();
    const text = document.createElement('a-entity');
    text.setAttribute('position', '0 0.1 -0.5');
    text.setAttribute('text', `width: 1; align: center; color: #00f900; value: ${message}`);
    this.hud.appendChild(text);
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

    box.addEventListener('click', (evt) => {
      console.log('EVT:', evt);
      this.el.parentNode.components['clues-component'].openClueBox(this);
    })
  },
  update () {

  },
  getMessage () {
    return this.data.message;
  }
});

AFRAME.registerComponent('walking-trail', {
  schema: {},
  init () {

  }
});

AFRAME.registerComponent('walking-trail-item', {
  schema: {},
  init () {
    const marker = document.createElement('a-entity');
    marker.setAttribute('geometry', 'primitive: circle; radius: 0.5');
    marker.setAttribute('material', 'color: red');
    marker.setAttribute('position', '0 0.01 0');
    marker.setAttribute('rotation', '-90 0 0');

    this.el.appendChild(marker);

    marker.addEventListener('click', (evt) => {
      console.log('EVT:', evt);

      const camera = document.querySelector('#camera');
      const {x, z} = marker.parentEl.getAttribute('position');
      const newPosition = Object.assign(camera.getAttribute('position'),
        {x: x-6.085,z});
      camera.setAttribute('position', newPosition);
    });
  }
});
