// I learned this means of particle manipulation from the JavaScript Game Dev course,
// credited in the README. 
// My innovation was to set particle direction based on attacker's facing direction
class Blood {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.markedForDeletion = false;
    this.gravity = 1;
  }
  update() {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.speedY -= this.gravity;
    this.size *= 0.9;
    if (this.size < 0.5) this.markedForDeletion = true;
  }
  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = this.colour;
    context.fill();
  }
}

export class ZombieBlood extends Blood {
  constructor(game, x, y) {
    super(game, x, y);
    this.size = Math.random() * 3 + 5;
    // Setting horizontal speed to depend on player facing direction is my idea.
    this.speedX = (Math.random() * 10 - 10) * this.game.player.facingRight;
    this.speedY = Math.random() * 15 + 1;
    this.colour = '#0aff0a';
  }
}

export class PlayerBlood extends Blood {
  constructor(game, x, y, enemyDirection) {
    super(game, x, y);
    this.enemyDirection = enemyDirection;
    this.size = Math.random() * 3 + 3;
    // Setting horizontal speed to depend on enemy facing direction is my idea.
    this.speedX = (Math.random() * 10 - 20) * enemyDirection;
    this.speedY = Math.random() * 15 + 1;
    this.colour = 'red';
  }
}