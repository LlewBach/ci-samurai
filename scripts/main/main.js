import { Background } from '../background/background.js';
import { Joystick, ControlPad, InputHandler } from '../input/input.js';
import { Zombie1, Zombie2 } from '../enemies/enemies.js';
import { Player } from '../player/player.js';
import { UI } from '../UI/UI.js';
import { MatrixRain } from '../matrix/matrix.js';

export class Game {
  constructor(width, height, canvas) {
    this.width = width;
    this.height = height;
    this.groundMargin = 90;
    this.speed = 0;
    this.background = new Background(this);
    this.joystick = new Joystick(90, this.height / 3, canvas);
    this.controlPad = new ControlPad(this.width - 90, 180, canvas, this);
    this.input = new InputHandler();
    this.UI = new UI(this);
    this.player = new Player(this);
    this.particles = [];
    this.floatingText = [];
    this.enemies = [];
    this.enemyTimer = 0;
    this.enemyInterval = 5000;
    this.score = 0;
    // this.winningScore = 20;
    this.health = 100;
    this.energy = 5;
    this.gameOver = false;
    this.isPaused = true;
    this.isTouchScreen = false;
    this.annotateMode = false;
    this.trainingMode = false;
    this.isFreshGame = true;
  }
  update(deltaTime) {
    this.background.update();
    if (this.isTouchScreen) this.joystick.update();
    this.player.update(deltaTime);
    if (!this.trainingMode) this.addEnemy(deltaTime);
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
    if (this.isTouchScreen) this.joystick.draw(context);
    if (this.isTouchScreen) this.controlPad.draw(context);
  }
  addEnemy(deltaTime) {
    // Requiring deltaTime to be > 20 prevents creating single enemy in training mode
    if (this.enemies.length === 0 && deltaTime > 20) {
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
    this.energy = 5;
    this.gameOver = false;
    this.isPaused = true;
    this.trainingMode = false;
    this.isFreshGame = true;
  }
}

window.addEventListener('load', function () {
  // The code relating to the loader is 99% directly from a tutorial
  const loader = document.querySelector('.loader');
  loader.classList.add('loader-hidden');
  loader.addEventListener('transitionend', () => {
    document.body.removeChild(loader);
  });
  // Below is my code

  const canvas1 = document.getElementById('canvas1');
  const ctx1 = canvas1.getContext('2d');
  canvas1.width = 800;
  canvas1.height = 500;

  const game = new Game(canvas1.width, canvas1.height, canvas1);

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

  // Below detects controls for pause/restart/annotate

  window.addEventListener('keydown', e => {
    if (e.key === ' ') {
      if (game.isPaused === false) game.isPaused = true;
      else {
        game.isPaused = false;
        game.isFreshGame = false;
        animate();
      }
    } else if (e.key === 'r') game.restart();
    else if (e.key === 'p') game.annotateMode = !game.annotateMode;
    else if (e.key === 't' && game.isFreshGame) {
      game.isFreshGame = false;
      game.trainingMode = true;
      game.isPaused = false;
      game.energy = 100;
      animate();
    }
  });

  // Below resets matrix canvas width upon screen resizing

  window.addEventListener('resize', e => {
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;
    matrix.resize(canvas2.width, canvas2.height);
  });

  // Below is for touch screen pause/restart functionality

  const swipeThreshold = 180;
  let touchX, touchY;

  window.addEventListener('touchstart', e => {
    game.isTouchScreen = true;
    touchX = e.changedTouches[0].clientX;
    touchY = e.changedTouches[0].clientY;
    // console.log(touchY);
  });

  window.addEventListener('touchend', e => {
    const endTouchX = e.changedTouches[0].clientX;
    const endTouchY = e.changedTouches[0].clientY;
    // console.log(endTouchY);
    // Swipe up
    if ((touchY - endTouchY) > swipeThreshold) {
      if (!game.gameOver) {
        if (game.isPaused === false) game.isPaused = true;
        else {
          game.isPaused = false;
          game.isFreshGame = false;
          animate();
        }
      } else {
        game.restart();
      }
      // Swipe left
    } else if ((touchX - endTouchX) > swipeThreshold && game.isFreshGame) {
      game.isFreshGame = false;
      game.trainingMode = true;
      game.isPaused = false;
      game.energy = 100;
      animate();
    } else if ((touchX - endTouchX) > swipeThreshold) {
      game.restart();
    }
  });
});

