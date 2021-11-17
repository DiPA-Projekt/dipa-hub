export enum FrequencyPattern {
  weekly = 'WEEKLY',
  monthly = 'MONTHLY',
}

export enum WeekdayPattern {
  mo = 'MO',
  tu = 'TU',
  we = 'WE',
  th = 'TH',
  fr = 'FR',
  sa = 'SA',
  su = 'SU',
}

export interface RrulePattern {
  frequency: FrequencyPattern;
  interval: number;
  byMonthDay: number;
  byDay: WeekdayPattern[];
}
