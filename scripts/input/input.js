// The controlpad provices a means for touchscreen players to use attacks. This is completely my idea.
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
  // Adds event listeners upon instantiation and pushes keys to keys array depending on touch coordinates
  addListeners(canvas) {
    // This function translates real screen coordinates into game canvas coordinates. This maintains functionality if the game canvas is reduced in size due to screen size limitations.
    const translateCoords = (e) => {
      // Gets coords of game canvas, which has a 5px border.
      const rect = canvas.getBoundingClientRect();
      // Compares actual width with given width to calculate scale.
      const scale = (rect.width - 10) / canvas.width;
      const actualX = e.changedTouches[0].clientX - rect.left - 5;
      const actualY = e.changedTouches[0].clientY - rect.top - 5;
      this.scaledX = actualX / scale;
      this.scaledY = actualY / scale;
    };
    // Determines which button pressed
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
    // Pushes key corresponding to attack option to array
    canvas.addEventListener('touchstart', e => {
      translateCoords(e);
      let button = checkWhichButton(this.scaledX, this.scaledY);
      if (button === 'button1' && this.keys.indexOf('a') === -1) this.keys.push('a');
      else if (button === 'button2' && this.keys.indexOf('s') === -1) this.keys.push('s');
      else if (button === 'button3' && this.keys.indexOf('d') === -1) this.keys.push('d');
      else if (button === 'button4' && this.keys.indexOf('f') === -1) this.keys.push('f');
    });
    // Splices out attack keys if button released.
    canvas.addEventListener('touchend', e => {
      translateCoords(e);
      let button = checkWhichButton(this.scaledX, this.scaledY);
      if (button === 'button1') this.keys.splice(this.keys.indexOf('a'));
      else if (button === 'button2') this.keys.splice(this.keys.indexOf('s'));
      else if (button === 'button3') this.keys.splice(this.keys.indexOf('d'));
      else if (button === 'button4') this.keys.splice(this.keys.indexOf('f'));
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

    // Button 1 - Note that fill colours depend on game object's energy status.
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    if (this.game.energy >= 1) context.fillStyle = 'red';
    else context.fillStyle = 'lightgray';
    context.fill();
    // Button 2
    context.beginPath();
    context.arc(this.x, this.y - 80, this.r, 0, Math.PI * 2);
    if (this.game.energy >= 5) context.fillStyle = '#0AFF0A';
    else context.fillStyle = 'lightgray';
    context.fill();
    // Button 3
    context.beginPath();
    context.arc(this.x, this.y + 80, this.r, 0, Math.PI * 2);
    if (this.game.energy >= 30) context.fillStyle = '#2DE1FC';
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

// The joystick provides touchscreen players with a convenient means of moving character. This was initially inspired by a tutorial credited in the README credits section. However, this was heavily modified to account for canvas scaling like the ControlPad above, joystick snapping behaviour, making simple press equivalent to holding 'Shift', and connecting with player states.
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
  addListeners(canvas) {
    const translateCoords = (e) => {
      const rect = canvas.getBoundingClientRect();
      // Canvas border has width 5px
      const scale = (rect.width - 10) / canvas.width;
      const actualX = e.changedTouches[0].clientX - rect.left - 5;
      const actualY = e.changedTouches[0].clientY - rect.top - 5;
      this.scaledX = actualX / scale;
      this.scaledY = actualY / scale;
    };
    // Detects joystick press and intitially sets coords where joystick should be draw.
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
    // Makes joystick want to follow touch coords.
    canvas.addEventListener('touchmove', e => {
      if (this.pressed) {
        translateCoords(e);
        this.x = this.scaledX;
        this.y = this.scaledY;
      }
    });
    // Makes joystick snap back to center when released
    canvas.addEventListener('touchend', () => {
      this.pressed = false;
      this.x = this.X;
      this.y = this.Y;
    });
  }
  update() {
    // First calculates whether joystick moved beyond threshold to trigger move and the angle.
    const xDistance = this.x - this.X;
    const yDistance = this.y - this.Y;
    const mouseDistance = Math.sqrt((xDistance * xDistance) + (yDistance * yDistance));
    this.angleRadians = Math.atan2(yDistance, xDistance);
    // Constantly emptying keys array.
    this.keys = [];
    // Adds joystick snapping behaviour and pushes selected keys to keys array.
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
      // Simply holding joystick button acts as 'Shift' which allows standing player to attack left.
    } else if (this.pressed) this.keys.push('Shift');
  }
  draw(context) {
    // Outer threshold circle
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

// This records relevant keyboard presses. 
// The architecture for this object I learned from the JavaScript Game Dev course by Franks Laboratory, credited in the README.
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
        e.key === 'Shift') &&
        this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key);
        // I changed motion controls after integrating them with player states, and it was easier to push the same keywords to the keys array.
      } else if ((e.key === 'j' || e.key === 'J') && this.keys.indexOf('ArrowLeft') === -1) {
        this.keys.push('ArrowLeft');
      } else if ((e.key === 'l' || e.key === 'L') && this.keys.indexOf('ArrowRight') === -1) {
        this.keys.push('ArrowRight');
      } else if ((e.key === 'i' || e.key === 'I') && this.keys.indexOf('ArrowUp') === -1) {
        this.keys.push('ArrowUp');
      } else if ((e.key === 'k' || e.key === 'K') && this.keys.indexOf('ArrowDown') === -1) {
        this.keys.push('ArrowDown');
      }
    });

    window.addEventListener('keyup', e => {
      if (
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
    });
  }
}