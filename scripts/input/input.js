export class InputHandler {
  constructor() {
    this.keys = [];

    window.addEventListener('keydown', e => {
      if ((
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'ArrowUp'
      ) && this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key);
      }
      // console.log(this.keys);
    });

    window.addEventListener('keyup', e => {
      if (
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'ArrowUp'
      ) {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
      // console.log(this.keys);
    });
  }
}