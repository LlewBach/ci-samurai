import { Background } from '../background/background.js';
import { InputHandler } from '../input/input.js';
import { Zombie1, Zombie2 } from '../enemies/enemies.js';
import { Player } from '../player/player.js';
import { UI } from '../UI/UI.js';

export class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.groundMargin = 90;
    this.speed = 0;
    this.background = new Background(this);
    this.input = new InputHandler();
    this.UI = new UI(this);
    this.player = new Player(this);
    this.enemies = [];
    this.enemyTimer = 0;
    this.enemyInterval = 5000;
    this.score = 0;
  }
  update(deltaTime) {
    this.background.update();
    this.player.update(deltaTime);
    this.addEnemy(deltaTime);
    this.enemies.forEach(enemy => enemy.update(deltaTime));
    this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
  }
  draw(context) {
    this.background.draw(context);
    this.player.draw(context);
    this.enemies.forEach(enemy => enemy.draw(context));
    this.UI.draw(context);
  }
  addEnemy(deltaTime) {
    if (this.enemies.length === 0) {
      this.enemies.push(new Zombie1(this));
    }
    if (this.enemyTimer < this.enemyInterval) this.enemyTimer += deltaTime;
    else {
      this.enemyTimer = 0;
      if (Math.random() < 0.5) this.enemies.push(new Zombie2(this));
    }
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