import { FloatingText } from "./floating-text";

let floatingMessage;
let mockContext;

describe('FloatingText class', () => {

  beforeEach(() => {
    floatingMessage = new FloatingText('test', 100, 100, 0, 0);

    mockContext = {
      font: '',
      fillStyle: '',
      fillText: jest.fn(),
    };
  });

  test('floatingMessage should be an instance of FloatingText', () => {
    expect(floatingMessage).toBeInstanceOf(FloatingText);
  });

  test('should contain necessary keys', () => {
    expect(floatingMessage).toHaveProperty('value');
    expect(floatingMessage).toHaveProperty('x');
    expect(floatingMessage).toHaveProperty('y');
    expect(floatingMessage).toHaveProperty('targetX');
    expect(floatingMessage).toHaveProperty('targetY');
    expect(floatingMessage).toHaveProperty('markedForDeletion');
  });

  test('should instantiate values correctly', () => {
    expect(floatingMessage.value).toBe('test');
    expect(floatingMessage.x).toBe(100);
    expect(floatingMessage.y).toBe(100);
    expect(floatingMessage.targetX).toBe(0);
    expect(floatingMessage.targetY).toBe(0);
  });

  test('.update should adjust values correctly', () => {
    floatingMessage.update();
    expect(floatingMessage.x).toBe(97);
    expect(floatingMessage.y).toBe(97);
    expect(floatingMessage.timer).toBe(1);
  });

  test('.update should change markedForDeletion status at certain timer value', () => {
    floatingMessage.timer = 101;
    floatingMessage.update();
    expect(floatingMessage.markedForDeletion).toBe(true);
  });

  test('.draw should update mockContext and call .fillText method', () => {
    floatingMessage.draw(mockContext);
    expect(mockContext.font).toBe('20px Helvetica');
    expect(mockContext.fillText).toHaveBeenCalledWith('test', 100, 100);
    expect(mockContext.fillText).toHaveBeenCalledWith('test', 102, 102);
  });
});