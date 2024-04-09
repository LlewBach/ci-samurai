import { ControlPad, Joystick, InputHandler } from './input.js';

describe('ControlPad class', () => {
  let controlPad, mockCanvas, mockContext, game;

  beforeEach(() => {
    mockCanvas = { addEventListener: jest.fn() };
    game = { energy: 0 };
    controlPad = new ControlPad(200, 200, mockCanvas, game);
    mockContext = {
      beginPath: jest.fn(),
      arc: jest.fn(),
      stroke: jest.fn(),
      fill: jest.fn(),
      fillText: jest.fn(),
    };
  });

  test('should have correct keys', () => {
    expect(controlPad).toHaveProperty('x');
    expect(controlPad).toHaveProperty('y');
    expect(controlPad).toHaveProperty('r');
    expect(controlPad).toHaveProperty('scaledX');
    expect(controlPad).toHaveProperty('scaledY');
    expect(controlPad).toHaveProperty('game');
  });

  test('.draw should correctly call context methods', () => {
    controlPad.draw(mockContext);
    expect(mockContext.beginPath).toHaveBeenCalledTimes(8);
    expect(mockContext.arc).toHaveBeenCalledTimes(8);
    expect(mockContext.stroke).toHaveBeenCalledTimes(4);
    expect(mockContext.fill).toHaveBeenCalledTimes(4);
    expect(mockContext.fillText).toHaveBeenCalledTimes(4);
  });
});

describe('Joystick class', () => {
  let joystick, mockContext;

  beforeEach(() => {
    const canvas1 = {
      width: 600,
      addEventListener: jest.fn(),
      getBoundingClientRect: jest.fn().mockReturnValue({ left: 10, top: 10, width: 310 }),
    };
    joystick = new Joystick(90, 170, canvas1);
    mockContext = {
      beginPath: jest.fn(),
      arc: jest.fn(),
      stroke: jest.fn(),
      fill: jest.fn()
    };
  });

  test('should have correct keys', () => {
    expect(joystick).toHaveProperty('keys');
    expect(joystick).toHaveProperty('x');
    expect(joystick).toHaveProperty('y');
    expect(joystick).toHaveProperty('r');
    expect(joystick).toHaveProperty('X');
    expect(joystick).toHaveProperty('Y');
    expect(joystick).toHaveProperty('R');
    expect(joystick).toHaveProperty('pressed');
    expect(joystick).toHaveProperty('scaledX');
    expect(joystick).toHaveProperty('scaledY');
  });

  test('translateCoords function correctly translates touch coords into scaled canvas coords', () => {
    const canvas1 = {
      width: 600,
      getBoundingClientRect: jest.fn().mockReturnValue({ left: 10, top: 10, width: 310 }),
    };

    const touchEvent = {
      changedTouches: [{
        clientX: 60,
        clientY: 100
      }]
    };
    let scaledX, scaledY;

    const translateCoords = (e) => {
      const rect = canvas1.getBoundingClientRect();
      const scale = (rect.width - 10) / canvas1.width;
      const actualX = e.changedTouches[0].clientX - rect.left - 5;
      const actualY = e.changedTouches[0].clientY - rect.top - 5;
      scaledX = actualX / scale;
      scaledY = actualY / scale;
    };
    translateCoords(touchEvent);
    expect(scaledX).toBe(90);
    expect(scaledY).toBe(170);
  });

  test('.update should snap joystick to set increments if mouseDistance beyond joystick perimeter', () => {
    joystick.x = joystick.X + 20;
    joystick.y = joystick.Y - 15;
    joystick.update();
    expect(joystick.angleRadians).not.toBe(-Math.PI / 4);
    joystick.x = joystick.X + 81;
    joystick.y = joystick.Y + 1;
    joystick.update();
    expect(joystick.angleRadians).toBe(0);
    expect(joystick.x).toBe(joystick.X + Math.cos(joystick.angleRadians) * joystick.R);
    expect(joystick.y).toBe(joystick.Y + Math.sin(joystick.angleRadians) * joystick.R);
    joystick.x = joystick.X + 81;
    joystick.y = joystick.Y - 80;
    joystick.update();
    expect(joystick.angleRadians).toBe(-Math.PI / 4);
    joystick.x = joystick.X + 1;
    joystick.y = joystick.Y - 81;
    joystick.update();
    expect(joystick.angleRadians).toBe(-Math.PI / 2);
    joystick.x = joystick.X - 81;
    joystick.y = joystick.Y - 80;
    joystick.update();
    expect(joystick.angleRadians).toBe(-Math.PI * 3 / 4);
    joystick.x = joystick.X - 81;
    joystick.y = joystick.Y - 1;
    joystick.update();
    expect(joystick.angleRadians).toBe(Math.PI);
    joystick.x = joystick.X - 81;
    joystick.y = joystick.Y + 80;
    joystick.update();
    expect(joystick.angleRadians).toBe(Math.PI * 3 / 4);
    joystick.x = joystick.X - 1;
    joystick.y = joystick.Y + 81;
    joystick.update();
    expect(joystick.angleRadians).toBe(Math.PI / 2);
    joystick.x = joystick.X + 81;
    joystick.y = joystick.Y + 80;
    joystick.update();
    expect(joystick.angleRadians).toBe(Math.PI / 4);
  });

  test('.update should push correct keys to the keys array under correct conditions', () => {
    joystick.x = joystick.X + 81;
    joystick.y = joystick.Y + 1;
    joystick.update();
    expect(joystick.keys).toContain('ArrowRight');
    joystick.x = joystick.X + 81;
    joystick.y = joystick.Y - 80;
    joystick.update();
    expect(joystick.keys).toContain('ArrowRight');
    expect(joystick.keys).toContain('ArrowUp');
    joystick.x = joystick.X + 1;
    joystick.y = joystick.Y - 81;
    joystick.update();
    expect(joystick.keys).toContain('ArrowUp');
    joystick.x = joystick.X - 81;
    joystick.y = joystick.Y - 80;
    joystick.update();
    expect(joystick.keys).toContain('ArrowLeft', 'ArrowUp');
    joystick.x = joystick.X - 81;
    joystick.y = joystick.Y - 1;
    joystick.update();
    expect(joystick.keys).toContain('ArrowLeft');
    joystick.x = joystick.X - 81;
    joystick.y = joystick.Y + 80;
    joystick.update();
    expect(joystick.keys).toContain('ArrowLeft', 'ArrowDown');
    joystick.x = joystick.X - 1;
    joystick.y = joystick.Y + 81;
    joystick.update();
    expect(joystick.keys).toContain('ArrowDown');
    joystick.x = joystick.X + 81;
    joystick.y = joystick.Y + 80;
    joystick.update();
    expect(joystick.keys).toContain('ArrowRight', 'ArrowDown');
    joystick.x = joystick.X + 10;
    joystick.y = joystick.Y + 10;
    joystick.pressed = true;
    joystick.update();
    expect(joystick.keys).toContain('Shift');
  });

  test('.update should empty keys array each time it runs', () => {
    joystick.keys = ['ArrowRight'];
    joystick.x = joystick.X + 20;
    joystick.y = joystick.Y - 15;
    joystick.update();
    expect(joystick.keys.length).toBe(0);
  });

  test('.draw should call context methods', () => {
    joystick.draw(mockContext);
    expect(mockContext.beginPath).toHaveBeenCalled();
    expect(mockContext.arc).toHaveBeenCalled();
    expect(mockContext.stroke).toHaveBeenCalled();
    expect(mockContext.fill).toHaveBeenCalled();
  });
});

describe('InputHandler class', () => {
  let inputHandler;

  beforeEach(() => {
    jest.spyOn(window, 'addEventListener');
    inputHandler = new InputHandler();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const simulateEvent = (type, key) => {
    const event = new KeyboardEvent(type, { key });
    window.dispatchEvent(event);
  };

  test('should have correct key', () => {
    expect(inputHandler).toHaveProperty('keys');
  });

  test('add ArrowLeft to keys on j key press', () => {
    simulateEvent('keydown', 'j');
    expect(inputHandler.keys).toContain('ArrowLeft');
  });

  test('removes ArrowLeft from keys on j keyup', () => {
    simulateEvent('keydown', 'j');
    simulateEvent('keyup', 'j');
    expect(inputHandler.keys).not.toContain('ArrowLeft');
  });

  test('does not add duplicates of ArrowLeft', () => {
    simulateEvent('keydown', 'j');
    simulateEvent('keydown', 'j');
    expect(inputHandler.keys.length).toBe(1);
  });

  test('ignores keys other than j, J, l, L, k, K, i, I, a, A, s, S, d, D, Shift, space, r, p', () => {
    simulateEvent('keydown', 't');
    expect(inputHandler.keys).toEqual([]);
  });
});