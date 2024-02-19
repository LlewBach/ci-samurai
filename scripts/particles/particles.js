export class ZombieBlood {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.markedForDeletion = false;
    this.size = Math.random() * 3 + 5;
    this.speedX = (Math.random() * 10 - 10) * this.game.player.facingRight;
    this.speedY = Math.random() * 15 + 1;
    this.gravity = 1;
    this.colour = 'darkgreen';
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