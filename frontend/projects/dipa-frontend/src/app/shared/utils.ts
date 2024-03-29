export default class Utils {
  public static getGermanFormattedDateString(input: string | Date): string {
    const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(input).toLocaleDateString('de-DE', dateOptions);
  }

  public static parseGermanDate(input: string): Date | null {
    const parts = input?.match(/(\d+)/g);
    if (!parts) {
      return null;
    } else {
      return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    }
  }

  public static createDateAtMidnight(date: string | Date): Date {
    const dateAtMidnight = new Date(date);
    dateAtMidnight.setHours(0, 0, 0, 0);
    return dateAtMidnight;
  }

  public static isValidUrl(urlString: string): boolean {
    const regex = /(https?)\:\/\/(www.)+[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,6}(\/\S*)?/;
    return regex.test(urlString);
  }

  public static getEventTypeAbbreviation(value: string): string {
    switch (value) {
      case 'TYPE_SINGLE_APPOINTMENT':
        return 'E';
      case 'TYPE_APPT_SERIES':
        return 'S';
      case 'TYPE_RECURRING_EVENT':
        return 'W';
    }
  }

  public static getEventTypeColorClass(value: string): string {
    switch (value) {
      case 'TYPE_SINGLE_APPOINTMENT':
        return '';
      case 'TYPE_APPT_SERIES':
        return 'bg-color-violett';
      case 'TYPE_RECURRING_EVENT':
        return 'bg-color-brown';
    }
  }
}
