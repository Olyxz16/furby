import { setExpiry } from './session.entity';

describe('Session Entity', () => {
  describe('setExpiry', () => {
    it('should return a date 7 days in the future', () => {
      const now = new Date('2023-01-01T00:00:00Z');
      const expected = new Date('2023-01-08T00:00:00Z');
      
      const result = setExpiry(new Date(now));
      
      expect(result).toEqual(expected);
    });

    it('should use current date if no argument provided', () => {
      // Mock Date
      const mockDate = new Date('2023-01-01T00:00:00Z');
      jest.useFakeTimers().setSystemTime(mockDate);
      
      const result = setExpiry();
      const expected = new Date('2023-01-08T00:00:00Z');
      
      expect(result).toEqual(expected);
      
      jest.useRealTimers();
    });
  });
});
