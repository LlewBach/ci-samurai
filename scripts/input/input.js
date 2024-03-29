export class ControlPad {
  constructor(x, y, canvas, game) {
    this.keys = [];
    this.x = x;
    this.y = y;
    this.r = 30;
    this.scaledX = 0;
    this.scaledY = 0;
    this.game = game;
    this.addListeners(canvas);
  }
  // Manually test addListeners method
  addListeners(canvas) {
    const translateCoords = (e) => {
      const rect = canvas.getBoundingClientRect();
      // Canvas border has width 5px
      const scale = (rect.width - 10) / canvas.width;
      const actualX = e.changedTouches[0].clientX - rect.left - 5;
      const actualY = e.changedTouches[0].clientY - rect.top - 5;
      this.scaledX = actualX / scale;
      this.scaledY = actualY / scale;
    }

    const checkWhichButton = (scaledX, scaledY) => {
      if (
        scaledX > (this.x - this.r) &&
        scaledX < (this.x + this.r) &&
        scaledY > (this.y - this.r) &&
        scaledY < (this.y + this.r)
      ) {
        return 'button1';
      }
      else if (
        scaledX > (this.x - this.r) &&
        scaledX < (this.x + this.r) &&
        scaledY > (this.y - 80 - this.r) &&
        scaledY < (this.y - 80 + this.r)
      ) {
        return 'button2';
      }
      else if (
        scaledX > (this.x - this.r) &&
        scaledX < (this.x + this.r) &&
        scaledY > (this.y + 80 - this.r) &&
        scaledY < (this.y + 80 + this.r)
      ) {
        return 'button3';
      }
      else if (
        scaledX > (this.x - 90 - this.r) &&
        scaledX < (this.x - 90 + this.r) &&
        scaledY > (this.y - this.r) &&
        scaledY < (this.y + this.r)
      ) {
        return 'button4';
      }
    };

    canvas.addEventListener('touchstart', e => {
      translateCoords(e);
      let button = checkWhichButton(this.scaledX, this.scaledY);
      if (button === 'button1' && this.keys.indexOf('a') === -1) this.keys.push('a');
      else if (button === 'button2' && this.keys.indexOf('s') === -1) this.keys.push('s');
      else if (button === 'button3' && this.keys.indexOf('d') === -1) this.keys.push('d');
      else if (button === 'button4' && this.keys.indexOf('f') === -1) this.keys.push('f');
      // console.log(this.keys);
    });

    canvas.addEventListener('touchend', e => {
      translateCoords(e);
      let button = checkWhichButton(this.scaledX, this.scaledY);
      if (button === 'button1') this.keys.splice(this.keys.indexOf('a'));
      else if (button === 'button2') this.keys.splice(this.keys.indexOf('s'));
      else if (button === 'button3') this.keys.splice(this.keys.indexOf('d'));
      else if (button === 'button4') this.keys.splice(this.keys.indexOf('f'));
      // console.log(this.keys);
    });
  }
  draw(context) {
    // Outer circle 1
    context.beginPath();
    context.arc(this.x, this.y, this.r + 1, 0, Math.PI * 2);
    context.strokeStyle = 'black';
    context.lineWidth = 3;
    context.stroke();
    // Outer circle 2
    context.beginPath();
    context.arc(this.x, this.y - 80, this.r + 1, 0, Math.PI * 2);
    context.stroke();
    // Outer circle 3
    context.beginPath();
    context.arc(this.x, this.y + 80, this.r + 1, 0, Math.PI * 2);
    context.stroke();
    // Outer circle 4
    context.beginPath();
    context.arc(this.x - 90, this.y, this.r + 1, 0, Math.PI * 2);
    context.stroke();

    // Button 1
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    if (this.game.energy >= 1) context.fillStyle = 'red';
    else context.fillStyle = 'lightgray';
    context.fill();
    // Button 2
    context.beginPath();
    context.arc(this.x, this.y - 80, this.r, 0, Math.PI * 2);
    if (this.game.energy >= 5) context.fillStyle = 'green';
    else context.fillStyle = 'lightgray';
    context.fill();
    // Button 3
    context.beginPath();
    context.arc(this.x, this.y + 80, this.r, 0, Math.PI * 2);
    if (this.game.energy >= 30) context.fillStyle = 'blue';
    else context.fillStyle = 'lightgray';
    context.fill();
    // Button 4
    context.beginPath();
    context.arc(this.x - 90, this.y, this.r, 0, Math.PI * 2);
    if (this.game.energy >= 50) context.fillStyle = 'yellow';
    else context.fillStyle = 'lightgray';
    context.fill();

    // Label 1
    context.font = '20px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('1', this.x, this.y);
    // Label 2
    context.fillText('2', this.x, this.y - 80);
    // Label 3
    context.fillText('3', this.x, this.y + 80);
    // Label 4
    context.fillText('4', this.x - 90, this.y);
  }
}

export class Joystick {
  constructor(x, y, canvas) {
    this.keys = [];
    this.x = x;
    this.y = y;
    this.r = 50;
    this.X = x;
    this.Y = y;
    this.R = this.r + 30;
    this.pressed = false;
    this.scaledX = 0;
    this.scaledY = 0;
    this.angleRadians = 0;
    this.addListeners(canvas);
  }
  // Manually test addListeners method
  addListeners(canvas) {
    const translateCoords = (e) => {
      const rect = canvas.getBoundingClientRect();
      // Canvas border has width 5px
      const scale = (rect.width - 10) / canvas.width;
      const actualX = e.changedTouches[0].clientX - rect.left - 5;
      const actualY = e.changedTouches[0].clientY - rect.top - 5;
      this.scaledX = actualX / scale;
      this.scaledY = actualY / scale;

      // console.log('actualX: ' + actualX, 'actualY: ' + actualY);
      // console.log('scale: ' + scale);
      // console.log('scaledX: ' + this.scaledX);
      // console.log('scaledY: ' + this.scaledY);
    };

    canvas.addEventListener('touchstart', e => {
      translateCoords(e);
      if (
        this.scaledX > (this.X - this.r) &&
        this.scaledX < (this.X + this.r) &&
        this.scaledY > (this.Y - this.r) &&
        this.scaledY < (this.Y + this.r)
      ) {
        this.pressed = true;
        this.x = this.scaledX;
        this.y = this.scaledY;
      }
    });

    canvas.addEventListener('touchmove', e => {
      if (this.pressed) {
        translateCoords(e);
        this.x = this.scaledX;
        this.y = this.scaledY;
      }
    });
    canvas.addEventListener('touchend', () => {
      this.pressed = false;
      this.x = this.X;
      this.y = this.Y;
    });
  }
  update() {
    const xDistance = this.x - this.X;
    const yDistance = this.y - this.Y;
    const mouseDistance = Math.sqrt((xDistance * xDistance) + (yDistance * yDistance));
    this.angleRadians = Math.atan2(yDistance, xDistance);
    // console.log('angleRadians: ' + this.angleRadians);
    this.keys = [];

    if (mouseDistance >= this.R) {
      if (this.angleRadians > -Math.PI / 8 && this.angleRadians <= Math.PI / 8) {
        this.angleRadians = 0;
        this.keys.push('ArrowRight');
      } else if (this.angleRadians > (-Math.PI * 3) / 8 && this.angleRadians <= -Math.PI / 8) {
        this.angleRadians = -Math.PI / 4;
        this.keys.push('ArrowRight', 'ArrowUp');
      } else if (this.angleRadians > (-Math.PI * 5) / 8 && this.angleRadians <= (-Math.PI * 3) / 8) {
        this.angleRadians = -Math.PI / 2;
        this.keys.push('ArrowUp');
      } else if (this.angleRadians > (-Math.PI * 7) / 8 && this.angleRadians <= -Math.PI * 5 / 8) {
        this.angleRadians = -Math.PI * 3 / 4;
        this.keys.push('ArrowLeft', 'ArrowUp');
      } else if (this.angleRadians > Math.PI * 7 / 8 || this.angleRadians <= -Math.PI * 7 / 8) {
        this.angleRadians = Math.PI;
        this.keys.push('ArrowLeft');
      } else if (this.angleRadians > Math.PI * 5 / 8 && this.angleRadians <= Math.PI * 7 / 8) {
        this.angleRadians = Math.PI * 3 / 4;
        this.keys.push('ArrowLeft', 'ArrowDown');
      } else if (this.angleRadians > Math.PI * 3 / 8 && this.angleRadians <= Math.PI * 5 / 8) {
        this.angleRadians = Math.PI / 2;
        this.keys.push('ArrowDown');
      } else {
        this.angleRadians = Math.PI / 4;
        this.keys.push('ArrowRight', 'ArrowDown');
      }

      this.x = this.X + Math.cos(this.angleRadians) * this.R;
      this.y = this.Y + Math.sin(this.angleRadians) * this.R;
    } else if (this.pressed) this.keys.push('Shift');
  }
  draw(context) {
    // Outer circle
    context.beginPath();
    context.arc(this.X, this.Y, this.R, 0, Math.PI * 2);
    context.strokeStyle = 'black';
    context.lineWidth = 3;
    context.stroke();

    // Knob
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    context.fillStyle = 'red';
    context.fill();
  }
}

export class InputHandler {
  constructor() {
    this.keys = [];

    window.addEventListener('keydown', e => {
      if ((
        e.key === 'a' ||
        e.key === 'A' ||
        e.key === 's' ||
        e.key === 'S' ||
        e.key === 'd' ||
        e.key === 'D' ||
        e.key === 'f' ||
        e.key === 'F' ||
        e.key === 'Shift')
        && this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key);
      } else if ((e.key === 'j' || e.key === 'J') && this.keys.indexOf('ArrowLeft') === -1) {
        this.keys.push('ArrowLeft');
      } else if ((e.key === 'l' || e.key === 'L') && this.keys.indexOf('ArrowRight') === -1) {
        this.keys.push('ArrowRight');
      } else if ((e.key === 'i' || e.key === 'I') && this.keys.indexOf('ArrowUp') === -1) {
        this.keys.push('ArrowUp');
      } else if ((e.key === 'k' || e.key === 'K') && this.keys.indexOf('ArrowDown') === -1) {
        this.keys.push('ArrowDown');
      }
      // console.log('Before: ', this.keys);
    });

    window.addEventListener('keyup', e => {
      if (
        // e.key === 'ArrowLeft' ||
        // e.key === 'ArrowRight' ||
        // e.key === 'ArrowUp' ||
        // e.key === 'ArrowDown' ||
        e.key === 'a' ||
        e.key === 'A' ||
        e.key === 's' ||
        e.key === 'S' ||
        e.key === 'd' ||
        e.key === 'D' ||
        e.key === 'f' ||
        e.key === 'F' ||
        e.key === 'Shift'
      ) {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      } else if (e.key === 'j' || e.key === 'J') {
        this.keys.splice(this.keys.indexOf('ArrowLeft'), 1);
      } else if (e.key === 'l' || e.key === 'L') {
        this.keys.splice(this.keys.indexOf('ArrowRight'), 1);
      } else if (e.key === 'i' || e.key === 'I') {
        this.keys.splice(this.keys.indexOf('ArrowUp'), 1);
      } else if (e.key === 'k' || e.key === 'K') {
        this.keys.splice(this.keys.indexOf('ArrowDown'), 1);
      }
      // console.log('After: ', this.keys);
    });
  }
}