import { Background } from '../background/background.js';
import { Joystick, ControlPad, InputHandler } from '../input/input.js';
import { Zombie1, Zombie2 } from '../enemies/enemies.js';
import { Player } from '../player/player.js';
import { UI } from '../user-interface/user-interface.js';
import { MatrixRain } from '../matrix/matrix.js';

// This is the central nervous system of the game.

// The architecture for this object was inspired by the JavaScript Game Dev course by Franks Laboratory, credited in the README. This is my own implementation of that architecture.

// I also learned to use deltaTime from the same course.
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
    this.enemyRandomFactor = 0.3;
    this.score = 0;
    this.winningScore = 333;
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
    // Updates components
    this.background.update();
    if (this.isTouchScreen) this.joystick.update();
    this.player.update(deltaTime);
    // Runs addEnemy method if real game in play
    if (!this.trainingMode && this.score < this.winningScore) this.addEnemy(deltaTime);
    this.enemies.forEach(enemy => enemy.update(deltaTime));
    // Removes enemies from array if their markedForDeletion property is true.
    this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
    this.particles.forEach(particle => particle.update());
    this.particles = this.particles.filter(particle => !particle.markedForDeletion);
    this.floatingText.forEach(message => message.update());
    this.floatingText = this.floatingText.filter(message => !message.markedForDeletion);
    this.healthCheck();
  }
  draw(context) {
    this.background.draw(context);
    // Adds opacity layer over background when game not running, making UI text more legible.
    if (this.isFreshGame || this.isPaused || this.gameOver || this.trainingMode) context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    else context.fillStyle = 'rgba(0, 0, 0, 0.1)';
    context.fillRect(0, 0, this.width, this.height);
    this.player.draw(context);
    this.enemies.forEach(enemy => enemy.draw(context));
    this.particles.forEach(particle => particle.draw(context));
    this.floatingText.forEach(message => message.draw(context));
    // Joystick and ControlPad only drawn if a touch event detected.
    if (this.isTouchScreen && !this.gameOver && !this.isPaused) this.joystick.draw(context);
    if (this.isTouchScreen && !this.gameOver && !this.isPaused) this.controlPad.draw(context);
    this.UI.draw(context);
  }
  addEnemy(deltaTime) {
    const randomEnemyType = () => Math.random() < 0.5 ? Zombie1 : Zombie2;
    let type = randomEnemyType();
    // Spaces new enemy appearances out
    if (this.enemyTimer < this.enemyInterval) this.enemyTimer += deltaTime;
    else {
      this.enemyTimer = 0;
      if (Math.random() < this.enemyRandomFactor) {
        // Instantiates one of two Zombie classes with a starting state of Standing.
        this.enemies.push(new type(this, 0));
        // Increasing the enemyRandomFactor makes it more likely an enemy will be added next time, making game difficulty increase over time.
        this.enemyRandomFactor += 0.02;
      }
      if (Math.random() < this.enemyRandomFactor) {
        // Instantiates one of two Zombie classes with a starting state of Spawning.
        this.enemies.push(new type(this, 3));
        this.enemyRandomFactor += 0.02;
      }
    }
  }
  // Checks whether player is out of health.
  healthCheck() {
    if (this.health <= 0) {
      this.gameOver = true;
    }
  }
  // Resets game properties and flags.
  restart() {
    this.speed = 0;
    this.player = new Player(this);
    this.particles = [];
    this.floatingText = [];
    this.enemies = [];
    this.enemyTimer = 0;
    this.enemyRandomFactor = 0.3;
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
  // The code relating to the loader is 90% directly from a tutorial
  const loader = document.querySelector('.loader');
  loader.classList.add('loader-hidden');
  loader.addEventListener('transitionend', () => {
    loader.remove();
  });
  // Below is back to my code

  const canvas1 = document.getElementById('canvas1');
  const ctx1 = canvas1.getContext('2d');
  canvas1.width = 800;
  canvas1.height = 500;

  const game = new Game(canvas1.width, canvas1.height, canvas1);

  let lastTimeAnimate = 0;

  function animate(timestamp) {
    // Wipes canvas clean every frame.
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    // Using deltaTime helps the game run at the same speed no matter the device's refresh rate.
    const deltaTime = timestamp - lastTimeAnimate;
    lastTimeAnimate = timestamp;
    game.update(deltaTime);
    game.draw(ctx1);
    if (!game.isPaused) requestAnimationFrame(animate);
  }

  // Instantiating the MatrixRain class and giving it its own animate function allows the effect to work when the game is paused.
  const canvas2 = document.getElementById('canvas2');
  const ctx2 = canvas2.getContext('2d');
  canvas2.width = window.innerWidth;
  canvas2.height = window.innerHeight;

  const matrix = new MatrixRain(game, canvas2.width, canvas2.height);

  let lastTimeAnimateMatrix = 0;

  function animateMatrix(timestamp) {
    const deltaTime = timestamp - lastTimeAnimateMatrix;
    lastTimeAnimateMatrix = timestamp;
    matrix.update(deltaTime);
    matrix.draw(ctx2);
    requestAnimationFrame(animateMatrix);
  }

  // Running the animations
  animateMatrix(0);
  animate(0);

  // Detects controls for pause/restart/annotate game
  window.addEventListener('keydown', e => {
    // Pause/unpause functionality
    if (e.key === ' ') {
      if (game.isPaused === false) game.isPaused = true;
      else {
        game.isPaused = false;
        game.isFreshGame = false;
        animate();
      }
      // Restart functionality
    } else if (e.key === 'r') game.restart();
    // Annotate mode toggle
    else if (e.key === 'p') game.annotateMode = !game.annotateMode;
    // Training mode initiation
    else if (e.key === 't' && game.isFreshGame) {
      game.isFreshGame = false;
      game.trainingMode = true;
      game.isPaused = false;
      game.energy = 100;
      game.health = 50;
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
  let touchX, touchY; // Touchstart coords

  window.addEventListener('touchstart', e => {
    // Detects touchscreen device
    game.isTouchScreen = true;
    touchX = e.changedTouches[0].clientX;
    touchY = e.changedTouches[0].clientY;
  });

  window.addEventListener('touchend', e => {
    const endTouchX = e.changedTouches[0].clientX;
    const endTouchY = e.changedTouches[0].clientY;
    // Swipe up gesture detection - controls pause and restart (if game over)
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
      // Swipe left gesture detection - allows Training Mode choice and mid-game restart.
      // Setting upper limit stops game from resetting when touching joystick and control pad simultaneously.
    } else if ((touchX - endTouchX) > swipeThreshold && touchX - endTouchX < swipeThreshold + 100 && game.isFreshGame) {
      game.isFreshGame = false;
      game.trainingMode = true;
      game.isPaused = false;
      game.energy = 100;
      game.health = 50;
      animate();
    } else if (touchX - endTouchX > swipeThreshold && touchX - endTouchX < swipeThreshold + 100) {
      game.restart();
    }
  });
});

