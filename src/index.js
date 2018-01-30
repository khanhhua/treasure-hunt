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
      const data = {
        message: `${clue.message}`,
        attributes: clue.attributes
      };
      if (clue.choices) {
        data.choices = clue.choices.map(choice => ({
          name: choice.name,
          attributes: choice.attributes,
          correct: choice.correct
        }));
      }
      clueBox.setAttribute('position', data.attributes.position);
      delete data.attributes.position;
      clueBox.setAttribute('clue-box', data);
      this.el.appendChild(clueBox);
    });
  },
  update () {

  },
  openClueBox (clueBox) {
    const message = clueBox.getMessage();
    this.hudMessage(message);

    if (clueBox.hasContent()) {
      clueBox.revealContent();
    }
  },
  hudMessage (message) {
    let text = this.hud.querySelector('[text]');
    if (text) {
      text.setAttribute('text', `width: 1; align: center; color: #00f900; value: ${message}`);
    } else {
      text = document.createElement('a-entity');
      text.setAttribute('position', '0 0.1 -0.5');
      text.setAttribute('text', `width: 1; align: center; color: #00f900; value: ${message}`);
      this.hud.appendChild(text);
    }
  }
});

AFRAME.registerComponent('clue-box', {
  schema: {
    message: {
      type: 'string'
    },
    choices: [
      {
        name: 'string',
        attributes: 'object',
        correct: 'boolean'
      }
    ],
    revealed: {
      type: 'boolean'
    }
  },
  init () {
    const box = document.createElement('a-entity');
    box.setAttribute('geometry', `primitive:sphere; radius:0.200`);
    box.setAttribute('material', `color:white; opacity:0.001`);
    box.className = 'clickable';
    this.el.appendChild(box);

    box.addEventListener('click', (evt) => {
      console.log('EVT:', evt);
      if (evt.target.className !== 'clickable') {
        return;
      }
      this.el.parentNode.components['clues-component'].openClueBox(this);
    });

    const shape = document.createElement('a-entity');
    Object.keys(this.data.attributes).forEach(attribute => {
      shape.setAttribute(attribute, this.data.attributes[attribute]);
    });
    box.appendChild(shape);
  },
  update () {

  },
  getMessage () {
    return this.data.message;
  },
  hasContent () {
    return this.data.choices && !!this.data.choices.length;
  },
  revealContent() {
    if (this.data.revealed) {
      return;
    }
    console.info('CONTENT:', this.data.choices);
    const choiceContainerEl = document.createElement('a-entity');

    const count = this.data.choices.length;
    const span = (count - 1) * 0.301;
    this.data.choices.forEach((choice, index) => {
      const choiceEl = document.createElement('a-entity');
      choiceEl.className = 'clickable';
      Object.keys(choice.attributes).forEach(attribute => {
        choiceEl.setAttribute(attribute, choice.attributes[attribute]);
      });
      choiceEl.setAttribute('position', {
        x: (index * 0.301)  - (span/2),
        y: 0.426,
        z: 0
      });

      choiceContainerEl.appendChild(choiceEl);
      choiceEl.addEventListener('click', (evt) => {
        if (choice.correct) {
          console.log('CONGRAT!!!');

          document.querySelector('[clues-component]').components['clues-component']
            .hudMessage('You won!');
        }
      })
    });

    const animation = document.createElement('a-animation');
    animation.setAttribute('attribute','rotation');
    animation.setAttribute('dur','5000');
    animation.setAttribute('to','0 360 0');
    animation.setAttribute('easing','linear');
    animation.setAttribute('repeat','indefinite');
    choiceContainerEl.appendChild(animation);

    this.el.appendChild(choiceContainerEl);
    this.data.revealed = true;
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
    marker.setAttribute('material', 'color: red; opacity: 0.16');
    marker.setAttribute('position', '0 0.01 0');
    marker.setAttribute('rotation', '-90 0 0');
    marker.className = 'clickable';

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
