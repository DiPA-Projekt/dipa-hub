import Utils from './utils';

describe('Utils-Test', () => {
  let date: Date;

  describe('Teste Methode createDateAtMidnight', () => {
    beforeEach(() => {
      // given
      date = new Date();
      expect(date.getHours()).not.toBe(0);
      expect(date.getMinutes()).not.toBe(0);
      expect(date.getSeconds()).not.toBe(0);
      expect(date.getMilliseconds()).not.toBe(0);
    });

    fit('test 1', () => {
      // given

      // when
      const midnightDate = Utils.createDateAtMidnight(date);

      // then
      expect(midnightDate.getHours()).toBe(0);
      expect(midnightDate.getMinutes()).toBe(0);
      expect(midnightDate.getSeconds()).toBe(0);
      expect(midnightDate.getMilliseconds()).toBe(0);
    });

    fit('test 2', () => {
      // given

      // when
      const midnightDate = Utils.createDateAtMidnight(date);

      // then
      expect(midnightDate.getHours()).toBe(0);
      expect(midnightDate.getMinutes()).toBe(0);
      expect(midnightDate.getSeconds()).toBe(0);
      expect(midnightDate.getMilliseconds()).toBe(0);
    });
  });
});
