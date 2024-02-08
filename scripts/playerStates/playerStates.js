const states = {
  STANDING: 0,
  RUNNING: 1,
}

class State {
  constructor(player) {
    this.player = player;
    this.player.frameX = 0;
  }
}

export class Standing extends State {
  constructor(player) {
    super(player);
  }
  enter() {
    this.player.maxFrame = 9;
    this.player.frameY = 0;
    this.player.speed = 0;

  }
  handleInput(inputKeys) {

  }
}