import ms from "ms";

enum DateType {
  absolute = "absolute",
  relative = "relative",
}

enum DateIndex {
  start = 0,
  end = 1,
}

export default class DateRange {
  dates: Date[] = [new Date(), new Date()];
  dateTypes: DateType[] = [DateType.relative, DateType.relative];
  displayText: string[] = ["", ""];
  finalDates: Date[] = [new Date(), new Date()];
  finalDisplayText: string[] = ["", ""];
  localeObj = {
    quickSelectTerms: ["", ""],
    quickSelectIntervals: ["", ""],
    relativeTerms: ["", ""],
    relativeIntervals: ["", ""],
    nowText: "",
  };
  constructor(localeObj) {
    this.localeObj = localeObj;
    this.setNow(DateIndex.start), this.setNow(DateIndex.end);
    this.applyChanges();
  }

  load(obj: DateRange): void {
    this.dates = obj.dates;
    this.displayText = obj.displayText;
    this.dateTypes = obj.dateTypes;
    this.finalDates = obj.finalDates;
    this.finalDisplayText = obj.finalDisplayText;
  }

  setQuickSelect(quickSelectText: String[]): void {
    this.setNow(DateIndex.start);
    this.setNow(DateIndex.end);

    if (quickSelectText[0].includes(this.localeObj.quickSelectTerms[1])) {
      this.dates[DateIndex.end].setTime(
        this.dates[DateIndex.start].getTime() + ms(quickSelectText[1])
      );
      this.displayText[DateIndex.start] = this.localeObj.nowText;
      this.displayText[DateIndex.end] =
        quickSelectText[1] + " " + this.localeObj.relativeTerms[1];
    } else if (
      quickSelectText[0].includes(this.localeObj.quickSelectTerms[0])
    ) {
      this.dates[DateIndex.start].setTime(
        this.dates[DateIndex.start].getTime() - ms(quickSelectText[1])
      );
      this.displayText[DateIndex.start] =
        quickSelectText[1] + " " + this.localeObj.relativeTerms[0];
      this.displayText[DateIndex.end] = this.localeObj.nowText;
    }
    this.dateTypes = [DateType.relative, DateType.relative];
  }

  static formatAbsoluteDate(
    date: Date,
    dateFormatter: Intl.DateTimeFormat
  ): string {
    return dateFormatter.format(date);
  }

  static formatAbsoluteTime(date: Date, timeFormat: string): string {
    return date.toLocaleTimeString(timeFormat);
  }

  setDate(
    date: Date,
    index: number,
    dateFormatter: Intl.DateTimeFormat,
    timeFormat: string
  ): void {
    this.dates[index] = date;
    this.displayText[index] =
      DateRange.formatAbsoluteDate(this.dates[index], dateFormatter) +
      " @ " +
      DateRange.formatAbsoluteTime(this.dates[index], timeFormat);
    this.dateTypes[index] = DateType.absolute;
  }

  setRelative(text: string, index: number): void {
    this.setNow(index);
    const textParts = [text.split(" ").slice(0, 2).join(" "), text];
    if (textParts[1].includes(this.localeObj.relativeTerms[0])) {
      this.dates[index].setTime(this.dates[index].getTime() - ms(textParts[0]));
    } else if (textParts[1].includes(this.localeObj.relativeTerms[1])) {
      this.dates[index].setTime(this.dates[index].getTime() + ms(textParts[0]));
    }
    this.displayText[index] = textParts[1];
    this.dateTypes[index] = DateType.relative;
  }

  refreshDates(): void {
    let i = 0;
    for (i = 0; i < this.dates.length; i++) {
      if (!this.isAbsolute(i)) {
        this.setRelative(this.finalDisplayText[i], i);
      }
    }
  }

  applyChanges(): void {
    this.finalDates = [this.dates[DateIndex.start], this.dates[DateIndex.end]];
    this.finalDisplayText = [
      this.displayText[DateIndex.start],
      this.displayText[DateIndex.end],
    ];
    this.refreshDates();
  }

  isAbsolute(index: number): Boolean {
    if (this.dateTypes[index] == DateType.absolute) {
      return true;
    } else {
      return false;
    }
  }
  setNow(index: number): void {
    this.dates[index] = new Date();
    this.displayText[index] = this.localeObj.nowText;
    this.dateTypes[index] = DateType.relative;
  }
}
