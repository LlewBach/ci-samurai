import { Player } from '../player/player.js';

export class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.player = new Player(this);
  }
}

window.addEventListener('load', function () {
  // const canvas = document.getElementById('canvas1');
  const canvas = canvas1;
  const ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 500;


});