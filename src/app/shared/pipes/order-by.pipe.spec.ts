import { OrderByPipe } from './order-by.pipe';

describe('OrderByPipe', () => {
  let orderBy: OrderByPipe;

  beforeEach(() => {
    orderBy = new OrderByPipe();
  });

  it('create an instance', () => {
    const pipe = new OrderByPipe();
    expect(pipe).toBeTruthy();
  });

  it('should sort an array in ascending order', () => {
    let data = [5, 3, 1, 2, 4];
    let result = [1, 2, 3, 4, 5];
    expect(orderBy.transform(data, '+')).toEqual(result);
  });

  it('should sort an array in descending order', () => {
    let data = [5, 3, 1, 2, 4];
    let result = [5, 4, 3, 2, 1];
    expect(orderBy.transform(data, '-')).toEqual(result);
  });

  it('should sort an array in ascending order based on a property', () => {
    let data = [{ q: 1 }, { q: 8 }, { q: 5 }];
    let result = [{ q: 1 }, { q: 5 }, { q: 8 }];
    expect(orderBy.transform(data, '+q')).toEqual(result);
  });

  it('should sort an array in descending order based on a property', () => {
    let data = [{ q: 1 }, { q: 8 }, { q: 5 }];
    let result = [{ q: 8 }, { q: 5 }, { q: 1 }];
    expect(orderBy.transform(data, '-q')).toEqual(result);
  });

  it('should sort an array based on multiple properties', () => {
    let data = [{ d: 'yada' }, { d: 'something', n: 8 }, { d: 'something', n: 4 }];
    let result = [{ d: 'something', n: 4 }, { d: 'something', n: 8 }, { d: 'yada' }];
    expect(orderBy.transform(data, ['+d', '+n'])).toEqual(result);
  });

  it('should sort an array based on a nested object', () => {
    let data = [
      { d: 'something', q: { n: 8 } },
      { d: 'yada', q: { n: 3 } },
      { d: 'something', q: { n: 4 } }
    ];
    let result = [
      { d: 'yada', q: { n: 3 } },
      { d: 'something', q: { n: 4 } },
      { d: 'something', q: { n: 8 } }
    ];
    expect(orderBy.transform(data, '+q.n')).toEqual(result);
  });

  it('should handle empty values gracefully', () => {
    expect(orderBy.transform(undefined)).toBe(undefined);
  });
});
