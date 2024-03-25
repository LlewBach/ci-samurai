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
    this.text3 = '';
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

    // New game message
    if (this.game.isFreshGame) {
      this.text1 = 'Fight well, Coder-san';
      this.text2 = 'Press spacebar or swipe up to start/pause';
      this.text3 = 'Press t or swipe down for Training Mode';
    }
    // Training Mode Messages
    else if (this.game.trainingMode) {
      if (this.game.score === 0) {
        this.text1 = "Jump";
        if (!this.game.isTouchScreen) this.text2 = "Press i key";
        else this.text2 = "Push joystick up";
        this.text3 = 'Jumping gives you energy!';
      } else if (this.game.score === 1) {
        this.text1 = "Learn to roll";
        if (!this.game.isTouchScreen) this.text2 = "Press k key";
        else this.text2 = "Push joystick down";
        this.text3 = 'Roll to land safely and escape attacks!';
      } else if (this.game.score === 2) {
        this.text1 = "Run right";
        if (!this.game.isTouchScreen) this.text2 = "Press l key";
        else this.text2 = "Push joystick right";
        this.text3 = '';
      } else if (this.game.score === 3) {
        this.text1 = "Run left";
        if (!this.game.isTouchScreen) this.text2 = "Press j key";
        else this.text2 = "Push joystick left";
        this.text3 = '';
      } else if (this.game.score === 4) {
        this.text1 = "Attack1 right";
        if (!this.game.isTouchScreen) this.text2 = "Press a key";
        else this.text2 = "Press button 1";
        this.text3 = 'Attack1 takes 1 energy';
      } else if (this.game.score === 5) {
        this.text1 = "Attack1 left";
        if (!this.game.isTouchScreen) this.text2 = "Press shift + a key";
        else this.text2 = "Hold down joystick and press button 1";
        this.text3 = 'Attack 1 kills one enemy in short range';
      } else if (this.game.score === 6) {
        this.text1 = "Attack2 right";
        if (!this.game.isTouchScreen) this.text2 = "Press s key";
        else this.text2 = "Press button 2";
        this.text3 = 'Attack2 takes 5 energy';
      } else if (this.game.score === 7) {
        this.text1 = "Attack2 left";
        if (!this.game.isTouchScreen) this.text2 = "Press shift + s key";
        else this.text2 = "Hold down joystick and press button 2";
        this.text3 = 'Attack2 kills all enemies in short range';
      } else if (this.game.score === 8) {
        this.text1 = "Attack3 right";
        if (!this.game.isTouchScreen) this.text2 = "Press d key";
        else this.text2 = "Press button 3";
        this.text3 = 'Attack3 takes 30 energy';
      } else if (this.game.score === 9) {
        this.text1 = "Attack3 left";
        if (!this.game.isTouchScreen) this.text2 = "Press shift + d key";
        else this.text2 = "Hold down joystick and press button 3";
        this.text3 = 'Attack3 kills all enemies in long range';
      } else if (this.game.score === 10) {
        this.text1 = 'Your training is complete';
        if (!this.game.isTouchScreen) this.text2 = 'Press r to go to start screen';
        else this.text2 = "Swipe down to go to start screen";
        this.text3 = '';
      }
      // Pause screen message
    } else if (!this.game.trainingMode && !this.game.isFreshGame && this.game.isPaused) {
      this.text1 = "Game Paused";
      if (!this.game.isTouchScreen) {
        this.text2 = "Press spacebar to continue";
        this.text3 = "Remember r key is restart";
      }
      else {
        this.text2 = "Swipe up to continue";
        this.text3 = "Remember swipe down to restart";
      }
      // Game Over screen messages
    } else if (this.game.gameOver) {
      context.textAlign = 'center';
      if (this.game.score >= this.game.winningScore) {
        this.text1 = 'Coder-san';
        this.text2 = 'You brought honour upon your cojo';
      }
      else {
        this.text1 = 'If you can\'t beat them...';
        this.text2 = 'Join them, Coder-san';
      }
    } else {
      this.text1 = '';
      this.text2 = '';
      this.text3 = '';
    }

    context.fillStyle = 'white';
    context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
    context.fillText(this.text1, this.game.width / 2, 150);
    context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
    context.fillText(this.text2, this.game.width / 2, 200);
    context.fillText(this.text3, this.game.width / 2, 240);
    context.fillStyle = 'darkred';
    context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
    context.fillText(this.text1, this.game.width / 2 + 2, 152);
    context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
    context.fillText(this.text2, this.game.width / 2 + 2, 202);
    context.fillText(this.text3, this.game.width / 2 + 2, 242);
  }
}