import { ThousandSuffixPipe } from './thousand-suffix.pipe';

describe('ThousandSuffixPipe', () => {
  it('create an instance', () => {
    const pipe = new ThousandSuffixPipe();
    expect(pipe).toBeTruthy();
  });
});
