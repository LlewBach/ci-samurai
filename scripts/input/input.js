export class Joystick {
  constructor(x, y, r, canvas) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.X = x;
    this.Y = y;
    this.R = r + 30;
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

      console.log('actualX: ' + actualX, 'actualY: ' + actualY);
      console.log('scale: ' + scale);
      console.log('scaledX: ' + this.scaledX);
      console.log('scaledY: ' + this.scaledY);
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

    if (mouseDistance > this.R) {
      if (this.angleRadians > -Math.PI / 8 && this.angleRadians <= Math.PI / 8) {
        this.angleRadians = 0;
      } else if (this.angleRadians > (-Math.PI * 3) / 8 && this.angleRadians <= -Math.PI / 8) {
        this.angleRadians = -Math.PI / 4;
      } else if (this.angleRadians > (-Math.PI * 5) / 8 && this.angleRadians <= (-Math.PI * 3) / 8) {
        this.angleRadians = -Math.PI / 2;
      } else if (this.angleRadians > (-Math.PI * 7) / 8 && this.angleRadians <= -Math.PI * 5 / 8) {
        this.angleRadians = -Math.PI * 3 / 4;
      } else if (this.angleRadians > Math.PI * 7 / 8 || this.angleRadians <= -Math.PI * 7 / 8) {
        this.angleRadians = Math.PI;
      } else if (this.angleRadians > Math.PI * 5 / 8 && this.angleRadians <= Math.PI * 7 / 8) {
        this.angleRadians = Math.PI * 3 / 4;
      } else if (this.angleRadians > Math.PI * 3 / 8 && this.angleRadians <= Math.PI * 5 / 8) {
        this.angleRadians = Math.PI / 2;
      } else {
        this.angleRadians = Math.PI / 4;
      }

      this.x = this.X + Math.cos(this.angleRadians) * this.R;
      this.y = this.Y + Math.sin(this.angleRadians) * this.R;
    }
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
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'a' ||
        e.key === 'A' ||
        e.key === 's' ||
        e.key === 'S' ||
        e.key === 'd' ||
        e.key === 'D' ||
        e.key === 'Shift' ||
        e.key === ' ' ||
        e.key === 'r'
      ) && this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key);
      }
    });

    window.addEventListener('keyup', e => {
      if (
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'a' ||
        e.key === 'A' ||
        e.key === 's' ||
        e.key === 'S' ||
        e.key === 'd' ||
        e.key === 'D' ||
        e.key === 'Shift' ||
        e.key === ' ' ||
        e.key === 'r'
      ) {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
    });
  }
}