// The majority of the code for this effect came from a tutorial.
// See README credits section for link. 
// I added colour interactivity and variable 'rain intensity'.

// This class codes the symbol that will be drawn in each column.
// Char objects are instantiated in the MatrixRain class below.
export class Char {
  constructor(xPosition, yPosition, fontSize, canvasHeight, game) {
    // The range of symbols used
    this.characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン1234567890';
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.fontSize = fontSize;
    this.text = '';
    this.canvasHeight = canvasHeight;
    this.game = game;
    // 'threshold' tunes how often each column's char will reset to the top
    this.threshold = 0.98;
  }
  update() {
    // 'Rain intensity' depends on game over status
    if (this.game.gameOver) this.threshold = 0.999;
    else this.threshold = 0.98;
    // The next symbol to be shown in the column
    this.text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
    // Increments symbol y position
    // and resets once moved offscreen and threshold crossed
    if (this.yPosition * this.fontSize > this.canvasHeight && Math.random() > this.threshold) this.yPosition = 0;
    else this.yPosition++;
  }
  draw(context) {
    // Draws symbol
    context.fillText(this.text, this.xPosition * this.fontSize, this.yPosition * this.fontSize);
  }
}

export class MatrixRain {
  constructor(game, canvasWidth, canvasHeight) {
    this.game = game;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.fontSize = 25;
    // Determines how many symbols to create
    this.columns = this.canvasWidth / this.fontSize;
    // Holds Symbol class objects
    this.symbols = [];
    // Frame rate control variables
    this.fps = 30; // 'fps' is 'frames per second'
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.colour = '#0aff0a';
    this.initialize();
  }
  // Instantiates Symbol objects for each column.
  initialize() {
    for (let i = 0; i < this.columns; i++) {
      this.symbols[i] = new Char(i, this.canvasHeight, this.fontSize, this.canvasHeight, this.game);
    }
  }
  // Sets symbol colour depending on game status. Called in update method.
  colourState() {
    if (this.game.gameOver) this.colour = 'white';
    else this.colour = '#0aff0a';
    // If player in Stun state (taking damage), symbols turn red.
    if (this.game.player.currentState === this.game.player.states[5]) this.colour = 'red';
  }
  update(deltaTime) {
    this.colourState();
    // Frame rate control based on deltaTime. Updates each Symbol every frame.
    if (this.frameTimer < this.frameInterval) this.frameTimer += deltaTime;
    else {
      this.frameTimer = 0;
      this.symbols.forEach(symbol => symbol.update());
    }
  }
  draw(context) {
    // Every draw to canvas covers previous drawing with semi-transparent rectangle.
    // This has the effect of making 'raindrop' trails fade as they fall
    context.fillStyle = 'rgba(0, 0, 0, 0.05)';
    context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    context.fillStyle = this.colour;
    // Using monospace helps maintain even spacing between rows and columns.
    context.font = this.fontSize + 'px monospace';
    // Draws each symbol
    this.symbols.forEach(symbol => symbol.draw(context));
  }
  // This resizes the canvas if the screen size changes.
  resize(width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.columns = this.canvasWidth / this.fontSize;
    this.symbols = [];
    this.initialize();
  }
}