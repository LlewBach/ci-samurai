export class UI {
  constructor(game) {
    this.game = game;
    this.x = 340;
    this.y = 450;
    this.r = 12;
    this.spacing = 60;
    this.fontSize = 30;
    this.fontFamily = 'Helvetica';
    this.fontColour = 'black';
    this.text1 = '';
    this.text2 = '';
  }
  draw(context) {
    context.font = this.fontSize + 'px ' + this.fontFamily;
    context.textAlign = 'left';
    context.fillStyle = this.fontColour;
    // Score
    context.fillText('Score: ' + this.game.score, 20, 50);
    // Health Bar
    context.fillText('Health: ' + this.game.health, 520, 50);
    context.fillStyle = 'green';
    context.fillRect(680, 29, this.game.health, 20);
    // Energy Bar
    context.fillStyle = 'black';
    context.fillText('Energy: ' + this.game.energy, 210, 50);
    context.fillStyle = 'blue';
    context.fillRect(380, 29, this.game.energy, 20);

    // Outer circle 1
    context.beginPath();
    context.arc(this.x, this.y, this.r + 1, 0, Math.PI * 2);
    context.strokeStyle = 'black';
    context.lineWidth = 3;
    context.stroke();
    // Outer circle 2
    context.beginPath();
    context.arc(this.x + this.spacing, this.y, this.r + 1, 0, Math.PI * 2);
    context.stroke();
    // Outer circle 3
    context.beginPath();
    context.arc(this.x + (2 * this.spacing), this.y, this.r + 1, 0, Math.PI * 2);
    context.stroke();

    // Indicator 1
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    if (this.game.energy >= 1) {
      context.fillStyle = 'pink';
    } else context.fillStyle = 'lightgray';
    context.fill();
    // Indicator 2
    context.beginPath();
    context.arc(this.x + this.spacing, this.y, this.r, 0, Math.PI * 2);
    if (this.game.energy >= 5) {
      context.fillStyle = 'lightgreen';
    } else context.fillStyle = 'lightgray';
    context.fill();
    // Indicator 3
    context.beginPath();
    context.arc(this.x + (2 * this.spacing), this.y, this.r, 0, Math.PI * 2);
    if (this.game.energy >= 30) {
      context.fillStyle = 'lightblue';
    } else context.fillStyle = 'lightgray';
    context.fill();

    // Label 1
    context.font = '20px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('1', this.x, this.y);
    // Label 2
    context.fillText('2', this.x + this.spacing, this.y);
    // Label 3
    context.fillText('3', this.x + (2 * this.spacing), this.y);

    // Game Over
    if (this.game.gameOver) {
      context.textAlign = 'center';
      if (this.game.score > 5) {
        this.text1 = 'Coder-san';
        this.text2 = 'You brought honour upon your cojo';
      }
      else {
        this.text1 = 'If you can\'t beat them...';
        this.text2 = 'Join them, Class-hopper';
      }
      context.fillStyle = 'white';
      context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
      context.fillText(this.text1, this.game.width / 2, 150);
      context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
      context.fillText(this.text2, this.game.width / 2, 190);
      context.fillStyle = 'black';
      context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
      context.fillText(this.text1, this.game.width / 2 + 2, 152);
      context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
      context.fillText(this.text2, this.game.width / 2 + 2, 192);
    }
  }
}