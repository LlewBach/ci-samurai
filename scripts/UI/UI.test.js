import { UI } from './UI.js';

describe('UI class', () => {
  let ui;
  let game;
  let mockContext;

  beforeEach(() => {
    game = {
      gameOver: false,
      score: 123,
      text1: '',
      text2: '',
      text3: '',
      isFreshGame: true,
      winningScore: 333,
      trainingMode: false,
      isFreshGame: true,
      isTouchScreen: false,
    };

    mockContext = {
      font: '',
      textAlign: '',
      fillStyle: '',
      fillText: jest.fn(),
      fillRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      stroke: jest.fn(),
      fill: jest.fn(),
    };

    ui = new UI(game);
  });

  test('should create an instance of UI', () => {
    expect(ui).toBeInstanceOf(UI);
  });

  test('should contain necessary keys', () => {
    expect(ui).toHaveProperty('game');
    expect(ui).toHaveProperty('x');
    expect(ui).toHaveProperty('y');
    expect(ui).toHaveProperty('r');
    expect(ui).toHaveProperty('spacing');
    expect(ui).toHaveProperty('fontSize');
    expect(ui).toHaveProperty('fontFamily1');
    expect(ui).toHaveProperty('fontFamily2');
    expect(ui).toHaveProperty('fontColour');
    expect(ui).toHaveProperty('text1');
    expect(ui).toHaveProperty('text2');
    expect(ui).toHaveProperty('text3');
  });

  test('.draw method should call correct context methods', () => {
    ui.draw(mockContext);
    expect(mockContext.fillText).toHaveBeenCalledTimes(13);
    expect(mockContext.fillRect).toHaveBeenCalledTimes(2);
    expect(mockContext.beginPath).toHaveBeenCalledTimes(8);
    expect(mockContext.arc).toHaveBeenCalledTimes(8);
    expect(mockContext.stroke).toHaveBeenCalledTimes(4);
    expect(mockContext.fill).toHaveBeenCalledTimes(4);
  });

  test('.draw method should set text1, text2 and text3 if isFreshGame', () => {
    ui.draw(mockContext);
    expect(ui.text1).toEqual('Die well, Coder-san');
    expect(ui.text2).toEqual('Press spacebar or swipe up to start/pause');
    expect(ui.text3).toEqual('Press t or swipe left for Training Mode');
  });

  test('.draw method should set text1, text2 and text3 if game.trainingMode is true and game.isTouchScreen is false, depending on the score', () => {
    game.isFreshGame = false;
    game.trainingMode = true;
    game.score = 0;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('Jump');
    expect(ui.text2).toEqual('Press i key');
    expect(ui.text3).toEqual('Jumping gives you energy!');
    game.score = 1;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('Learn to roll');
    expect(ui.text2).toEqual('Press k key');
    expect(ui.text3).toEqual('Roll to land safely and escape attacks!');
    game.score = 2;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('Run right');
    expect(ui.text2).toEqual('Press l key');
    expect(ui.text3).toEqual('');
    game.score = 3;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('Run left');
    expect(ui.text2).toEqual('Press j key');
    expect(ui.text3).toEqual('');
    game.score = 4;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('Attack1 right');
    expect(ui.text2).toEqual('Press a key');
    expect(ui.text3).toEqual('Attack1 takes 1 energy');
    game.score = 5;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('Attack1 left');
    expect(ui.text2).toEqual('Press shift + a key');
    expect(ui.text3).toEqual('Attack 1 kills one enemy in short range');
    game.score = 6;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('Attack2 right');
    expect(ui.text2).toEqual('Press s key');
    expect(ui.text3).toEqual('Attack2 takes 5 energy');
    game.score = 7;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('Attack2 left');
    expect(ui.text2).toEqual('Press shift + s key');
    expect(ui.text3).toEqual('Attack2 kills all enemies in short range');
    game.score = 8;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('Attack3 right');
    expect(ui.text2).toEqual('Press d key');
    expect(ui.text3).toEqual('Attack3 takes 30 energy');
    game.score = 9;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('Attack3 left');
    expect(ui.text2).toEqual('Press shift + d key');
    expect(ui.text3).toEqual('Long range and generates +5 health');
    game.score = 10;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('Attack4');
    expect(ui.text2).toEqual('Press f key');
    expect(ui.text3).toEqual('Generates +25 health');
    game.score = 11;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('Your training is complete');
    expect(ui.text2).toEqual('Press r to go to start screen');
    expect(ui.text3).toEqual('');
  });

  test('.draw method should alter text2 messages if game.trainingMode is true and game.isTouchScreen is true, depending on the score', () => {
    game.isFreshGame = false;
    game.trainingMode = true;
    game.isTouchScreen = true;
    game.score = 0;
    ui.draw(mockContext);
    expect(ui.text2).toEqual('Push joystick up');
    game.score = 1;
    ui.draw(mockContext);
    expect(ui.text2).toEqual('Push joystick down');
    game.score = 2;
    ui.draw(mockContext);
    expect(ui.text2).toEqual('Push joystick right');
    game.score = 3;
    ui.draw(mockContext);
    expect(ui.text2).toEqual('Push joystick left');
    game.score = 4;
    ui.draw(mockContext);
    expect(ui.text2).toEqual('Press button 1');
    game.score = 5;
    ui.draw(mockContext);
    expect(ui.text2).toEqual('Hold down joystick and press button 1');
    game.score = 6;
    ui.draw(mockContext);
    expect(ui.text2).toEqual('Press button 2');
    game.score = 7;
    ui.draw(mockContext);
    expect(ui.text2).toEqual('Hold down joystick and press button 2');
    game.score = 8;
    ui.draw(mockContext);
    expect(ui.text2).toEqual('Press button 3');
    game.score = 9;
    ui.draw(mockContext);
    expect(ui.text2).toEqual('Hold down joystick and press button 3');
    game.score = 10;
    ui.draw(mockContext);
    expect(ui.text2).toEqual('Press button 4');
    game.score = 11;
    ui.draw(mockContext);
    expect(ui.text2).toEqual('Swipe left to go to start screen');
  });

  test('.draw method should set text1 if trainingMode is false and energy is 0', () => {
    game.isFreshGame = false;
    game.energy = 0;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('Jump for energy!');
  });

  test('.draw method should set text1 and text2 if game.isPaused is true, game.isFreshGame is false and game.trainingMode is false', () => {
    game.isFreshGame = false;
    game.trainingMode = false;
    game.isPaused = true;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('Game Paused');
    expect(ui.text2).toEqual('Press spacebar to continue');
    expect(ui.text3).toEqual('Remember r key is restart');
    game.isTouchScreen = true;
    ui.draw(mockContext);
    expect(ui.text2).toEqual('Swipe up to continue');
    expect(ui.text3).toEqual('Remember swipe left to restart');
  });

  test('.draw method should set text1 and text2 if gameOver is true and depending on score', () => {
    game.isFreshGame = false;
    game.score = 4;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('');
    game.gameOver = true;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('If you can\'t beat them...');
    expect(ui.text2).toEqual('Join them, Coder-san');
    game.score = 150;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('Your rage is strong');
    expect(ui.text2).toEqual('Redemption is within reach');
    game.score = game.winningScore;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('Your code is cleansed!');
    expect(ui.text2).toEqual('You are the One');
  });

  test('.draw method should set text3 messages if gameOver is true and according to .isTouchScreen status', () => {
    game.isFreshGame = false;
    game.gameOver = true;
    ui.draw(mockContext);
    expect(ui.text3).toEqual('Press r key to restart');
    game.isTouchScreen = true;
    ui.draw(mockContext);
    expect(ui.text3).toEqual('Swipe up to restart');
  });
});

