import { Background } from '../background/background.js';
import { InputHandler } from '../input/input.js';
import { Player } from '../player/player.js';

export class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.groundMargin = 90;
    this.speed = 0;
    this.background = new Background(this);
    this.input = new InputHandler();
    this.player = new Player(this);
  }
  update(deltaTime) {
    this.background.update();
    this.player.update(deltaTime);
  }
  draw(context) {
    this.background.draw(context);
    this.player.draw(context);
  }
}

window.addEventListener('load', function () {
  // const canvas = document.getElementById('canvas1');
  const canvas = canvas1;
  const ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 500;

  const game = new Game(canvas.width, canvas.height);

  let lastTime = 0;

  function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(animate);
  }

  animate(0);

});