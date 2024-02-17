export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = 'Helvetica';
    this.fontColour = 'black';
  }
  draw(context) {
    context.font = this.fontSize + 'px ' + this.fontFamily;
    context.textAlign = 'left';
    context.fillStyle = this.fontColour;
    // Score
    context.fillText('Score: ' + this.game.score, 20, 50);
  }
}