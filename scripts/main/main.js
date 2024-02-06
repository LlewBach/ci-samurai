import { Player } from '../player/player.js';

export class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.player = new Player(this);
  }
  update() {
    // this.player.update();
  }
  draw(context) {
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

  // const lastTime = 0;

  function animate() {
    // const deltaTime = timestamp - lastTime;
    // lastTime = timestamp;
    game.update();
    game.draw(ctx);
    requestAnimationFrame(animate);
  }

  animate();

});