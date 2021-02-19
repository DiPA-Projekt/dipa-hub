export default class Utils {
  static parseGermanDate(input: string): Date | null {
    const parts = input?.match(/(\d+)/g);
    if (!parts) {
      return null;
    } else {
      return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    }
  }

  static createDateAtMidnight(date: string | Date): Date {
    const dateAtMidnight = new Date(date);
    dateAtMidnight.setHours(0, 0, 0, 0);
    return dateAtMidnight;
  }
}
