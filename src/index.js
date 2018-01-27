/* global AFRAME */
import './index.css';

const clues = require('./clues.json');

AFRAME.registerComponent('clues-component', {
  schema: {
  },
  init () {
    clues.forEach(clue => {
      const entity = document.createElement('a-entity');
      entity.setAttribute('geometry', `primitive:box;height:0.1;depth:0.1;width:0.1`);
      entity.setAttribute('position', clue.position);
      entity.setAttribute('material', 'color:green;');

      this.el.appendChild(entity);
    });
  },
  update () {

  }
})
