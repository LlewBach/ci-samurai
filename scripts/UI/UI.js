export class UI {
  constructor(game) {
    this.game = game;
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
    context.fillText('Health: ' + this.game.health, 420, 50);
    context.fillStyle = 'green';
    context.fillRect(580, 29, this.game.health * 2, 20);
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