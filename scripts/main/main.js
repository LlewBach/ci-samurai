import { Background } from '../background/background.js';
import { Joystick, InputHandler } from '../input/input.js';
import { Zombie1, Zombie2 } from '../enemies/enemies.js';
import { Player } from '../player/player.js';
import { UI } from '../UI/UI.js';
import { MatrixRain } from '../matrix/matrix.js';

export class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.groundMargin = 90;
    this.speed = 0;
    this.background = new Background(this);
    this.joystick = new Joystick(90, this.height / 3, 50);
    this.input = new InputHandler();
    this.UI = new UI(this);
    this.player = new Player(this);
    this.particles = [];
    this.floatingText = [];
    this.enemies = [];
    this.enemyTimer = 0;
    this.enemyInterval = 5000;
    this.score = 0;
    this.winningScore = 20;
    this.health = 100;
    this.gameOver = false;
    this.isPaused = false;
  }
  update(deltaTime) {
    this.background.update();
    this.player.update(deltaTime);
    // this.addEnemy(deltaTime);
    this.enemies.forEach(enemy => enemy.update(deltaTime));
    this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
    this.particles.forEach(particle => particle.update());
    this.particles = this.particles.filter(particle => !particle.markedForDeletion);
    this.floatingText.forEach(message => message.update());
    this.floatingText = this.floatingText.filter(message => !message.markedForDeletion);
    this.healthCheck();
  }
  draw(context) {
    this.background.draw(context);
    this.player.draw(context);
    this.enemies.forEach(enemy => enemy.draw(context));
    this.particles.forEach(particle => particle.draw(context));
    this.floatingText.forEach(message => message.draw(context));
    this.UI.draw(context);
    this.joystick.draw(context);
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
  healthCheck() {
    if (this.health <= 0) {
      this.gameOver = true;
    }
  }
  restart() {
    this.speed = 0;
    this.player = new Player(this);
    this.particles = [];
    this.floatingText = [];
    this.enemies = [];
    this.score = 0;
    this.health = 100;
    this.gameOver = false;
    this.isPaused = false;
  }
}

window.addEventListener('load', function () {
  const canvas1 = document.getElementById('canvas1');
  const ctx1 = canvas1.getContext('2d');
  canvas1.width = 800;
  canvas1.height = 500;

  const game = new Game(canvas1.width, canvas1.height);

  let lastTime1 = 0;

  function animate(timestamp) {
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    const deltaTime = timestamp - lastTime1;
    lastTime1 = timestamp;
    game.update(deltaTime);
    game.draw(ctx1);
    if (!game.isPaused) requestAnimationFrame(animate);
  }

  const canvas2 = document.getElementById('canvas2');
  const ctx2 = canvas2.getContext('2d');
  canvas2.width = window.innerWidth;
  canvas2.height = window.innerHeight;

  const matrix = new MatrixRain(game, canvas2.width, canvas2.height);

  let lastTime2 = 0;

  function animateMatrix(timestamp) {
    const deltaTime = timestamp - lastTime2;
    lastTime2 = timestamp;
    matrix.update(deltaTime);
    matrix.draw(ctx2);
    requestAnimationFrame(animateMatrix);
  }

  animateMatrix(0);
  animate(0);

  window.addEventListener('keydown', e => {
    if (e.key === ' ') {
      if (game.isPaused === false) game.isPaused = true;
      else {
        game.isPaused = false;
        animate();
      }
    } else if (e.key === 'r' && game.gameOver) game.restart();
  });

  window.addEventListener('resize', e => {
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;
    matrix.resize(canvas2.width, canvas2.height);
  });
});

