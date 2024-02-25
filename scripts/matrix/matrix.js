export class Symbol {
  constructor(x, y, fontSize, canvasHeight, game) {
    this.characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン1234567890';
    this.x = x;
    this.y = y;
    this.fontSize = fontSize;
    this.text = '';
    this.canvasHeight = canvasHeight;
    this.game = game;
    this.threshold = 0.98;
  }
  update() {
    if (this.game.gameOver) this.threshold = 0.999;
    else this.threshold = 0.98;
    this.text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
    if (this.y * this.fontSize > this.canvasHeight && Math.random() > this.threshold) this.y = 0;
    else this.y++;
  }
  draw(context) {
    context.fillText(this.text, this.x * this.fontSize, this.y * this.fontSize);
  }
}

export class MatrixRain {
  constructor(game, canvasWidth, canvasHeight) {
    this.game = game;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.fontSize = 25;
    this.columns = this.canvasWidth / this.fontSize;
    this.symbols = [];
    this.fps = 30;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.colour = '#0aff0a';
    this.initialize();
  }
  initialize() {
    for (let i = 0; i < this.columns; i++) {
      this.symbols[i] = new Symbol(i, this.canvasHeight, this.fontSize, this.canvasHeight, this.game);
    }
  }
  colourState() {
    if (this.game.gameOver) this.colour = 'white';
    else this.colour = '#0aff0a';
    if (this.game.player.currentState === this.game.player.states[5]) this.colour = 'red';
    // else if (this.game.enemies.some(enemy => enemy.currentState === enemy.states[2])) this.colour = '#3137fd';
  }
  update(deltaTime) {
    this.colourState();
    if (this.frameTimer < this.frameInterval) this.frameTimer += deltaTime;
    else {
      this.frameTimer = 0;
      this.symbols.forEach(symbol => symbol.update());
    }
  }
  draw(context) {
    context.fillStyle = 'rgba(0, 0, 0, 0.05)';
    context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    context.fillStyle = this.colour;
    context.font = this.fontSize + 'px monospace';
    this.symbols.forEach(symbol => symbol.draw(context));
  }
}