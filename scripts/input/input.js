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

class Joystick {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.X = x;
    this.Y = y;
    this.R = r;
  }
}