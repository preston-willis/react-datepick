export interface Locale {
  weekDays: string[];
  localeString: string;
  dateFormatter: Intl.DateTimeFormat;
  quickSelectTerms: string[];
  relativeTerms: string[];
  nowText: string;
  humanizer: any;
}

export interface OptionalLocale {
  localeString?: string;
  dateFormatter?: Intl.DateTimeFormat;
  quickSelectTerms?: string[];
  relativeTerms?: string[];
  nowText?: string;
  humanizer?: any;
}

export function getWeekDays(localeString: string) {
  const shortWeekdayDateMap = {
    Mon: new Date("2020-01-06"),
    Tue: new Date("2020-01-07"),
    Wed: new Date("2020-01-08"),
    Thu: new Date("2020-01-09"),
    Fri: new Date("2020-01-10"),
    Sat: new Date("2020-01-11"),
    Sun: new Date("2020-01-12"),
  };

  const shortWeekdays = Object.keys(shortWeekdayDateMap);

  const getDayOfWeek = (
    shortName: string,
    locale = localeString,
    length = "short"
  ) =>
    new Intl.DateTimeFormat(locale, { weekday: length }).format(
      shortWeekdayDateMap[shortName]
    );

  const getDaysOfWeek = (locale = localeString, length = "short") =>
    shortWeekdays.map((shortName) => getDayOfWeek(shortName, locale, length));

  return getDaysOfWeek(localeString);
}
