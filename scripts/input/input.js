export class InputHandler {
  constructor() {
    this.keys = [];
    this.touchY = '';
    this.swipeThreshold = 30;

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

    window.addEventListener('touchstart', e => {
      this.touchY = e.changedTouches[0].pageY;
    });
    window.addEventListener('touchmove', e => {
      const swipeDistance = e.changedTouches[0].pageY - this.touchY;
      if (swipeDistance < -this.swipeThreshold && this.keys.indexOf('swipe up') === -1) this.keys.push('swipe up');
      else if (swipeDistance > this.swipeThreshold && this.keys.indexOf('swipe down') === -1) this.keys.push('swipe down');
    });
    window.addEventListener('touchend', e => {
      this.keys.splice(this.keys.indexOf('swipe up'), 1);
      this.keys.splice(this.keys.indexOf('swipe down'), 1);
    });
  }
}