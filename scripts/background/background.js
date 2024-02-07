export class Layer {
  constructor(game, width, height, image, speedModifier) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.image = image;
    this.speedModifier = speedModifier;
    this.x = 0;
    this.y = 0;
  }
  update() {
    // Left boundary
    if (this.x >= 0) this.x = 0;
    // Reset
    else if (this.x < -this.width) this.x = 0;
    // Motion
    this.x -= this.game.speed * this.speedModifier;
  }
  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
    context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
  }
}

export class Background {
  constructor(game) {
    this.game = game;
    this.width = 3199;
    this.height = 943;
    this.layer1Image = layer1;
    this.layer2Image = layer2;
    this.layer3Image = layer3;
    this.layer4Image = layer4;
    this.layer1 = new Layer(this.game, this.width, this.height, this.layer1Image, 0.2);
    this.layer2 = new Layer(this.game, this.width, this.height, this.layer2Image, 0.3);
    this.layer3 = new Layer(this.game, this.width, this.height, this.layer3Image, 0.5);
    this.layer4 = new Layer(this.game, this.width, this.height, this.layer4Image, 1);
    this.backgroundLayers = [this.layer1, this.layer2, this.layer3, this.layer4];
  }
  update() {
    this.backgroundLayers.forEach(layer => layer.update());
  }
  draw(context) {
    this.backgroundLayers.forEach(layer => layer.draw(context));
  }
}

const layer1 = document.getElementById('layer1');
const layer2 = document.getElementById('layer2');
const layer3 = document.getElementById('layer3');
const layer4 = document.getElementById('layer4');