const humanizer = require("humanize-duration");

export enum DateType {
  absolute = "absolute",
  relative = "relative",
}

enum DateIndex {
  start = 0,
  end = 1,
}

export enum TermContext {
  quickSelect = "quickSelect",
  relative = "relative",
}

export class DateRange {
  dates: Date[] = [new Date(), new Date()];
  dateTypes: DateType[] = [DateType.relative, DateType.relative];
  displayText: string[] = ["", ""];
  finalDates: Date[] = [new Date(), new Date()];
  relativeMS: number[] = [0, 0];
  finalDisplayText: string[] = ["", ""];
  localeObj = {
    localeString: "en",
    quickSelectTerms: ["", ""],
    quickSelectIntervals: ["", ""],
    relativeTerms: ["", ""],
    relativeIntervals: ["", ""],
    nowText: "",
    humanizer: humanizer.humanizer({
      language: "en",
    }),
  };

  constructor(localeObj) {
    this.localeObj = localeObj;
    this.setNow(DateIndex.start);
    this.setNow(DateIndex.end);
    this.applyChanges();
  }

  load(obj: DateRange): void {
    this.dates = obj.dates;
    this.displayText = obj.displayText;
    this.dateTypes = obj.dateTypes;
    this.finalDates = obj.finalDates;
    this.finalDisplayText = obj.finalDisplayText;
    this.relativeMS = obj.relativeMS;
  }

  setQuickSelect(quickSelectText: number[]): void {
    this.setNow(DateIndex.start);
    this.setNow(DateIndex.end);

    if (quickSelectText[0] == 1) {
      this.dates[DateIndex.end].setTime(
        this.dates[DateIndex.end].getTime() + quickSelectText[1]
      );
      this.relativeMS = [0, quickSelectText[1] * quickSelectText[0]];
      this.displayText[DateIndex.start] = this.localeObj.nowText;
      this.displayText[DateIndex.end] =
        this.localeObj.humanizer(quickSelectText[1]) +
        " " +
        this.localeObj.relativeTerms[DateIndex.end];
    } else if (quickSelectText[0] == -1) {
      this.relativeMS = [quickSelectText[0] * quickSelectText[1], 0];
      this.dates[DateIndex.start].setTime(
        this.dates[DateIndex.start].getTime() - quickSelectText[1]
      );
      this.displayText[DateIndex.start] =
        this.localeObj.humanizer(quickSelectText[1]) +
        " " +
        this.localeObj.relativeTerms[DateIndex.start];
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

  static splitMilliseconds(ms: number): number[] {
    let out = [-1, 0];
    out[1] = Math.abs(ms);
    if (ms >= 0) {
      out[0] = 1;
    }

    return out;
  }

  multiplierToHumanized(mult: number, type: TermContext): string {
    let out = "";
    let terms = this.localeObj.relativeTerms;
    if (type == TermContext.quickSelect) {
      terms = this.localeObj.quickSelectTerms;
    }
    if (mult == -1) {
      out = terms[0];
    } else {
      out = terms[1];
    }
    return out;
  }

  millisecondsToHumanized(array: number[], type: TermContext): string[] {
    let out = ["", ""];
    out[0] = this.multiplierToHumanized(array[0], type);
    if (array[1] != 0) {
      out[1] = this.localeObj.humanizer(Math.abs(array[1]));
    } else {
      out[1] = this.localeObj.nowText;
    }
    return out;
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

  setRelative(ms: number, index: number): void {
    this.setNow(index);
    this.relativeMS[index] = ms;
    this.dates[index].setTime(this.dates[index].getTime() + ms);

    let postfix = " ";

    if (ms != 0) {
      if (ms > 0) {
        postfix += this.localeObj.relativeTerms[1];
      } else if (ms < 0) {
        postfix += this.localeObj.relativeTerms[0];
      }
      this.displayText[index] = this.localeObj.humanizer(ms) + postfix;
    } else {
      this.displayText[index] = this.localeObj.nowText;
    }

    this.dateTypes[index] = DateType.relative;
  }

  refreshDates(): void {
    let i = 0;
    for (i = 0; i < this.dates.length; i++) {
      if (!this.isAbsolute(i)) {
        this.setRelative(this.relativeMS[i], i);
      }
    }
  }
  applyChanges(): void {
    this.refreshDates();
    this.finalDates = [this.dates[DateIndex.start], this.dates[DateIndex.end]];
    this.finalDisplayText = [
      this.displayText[DateIndex.start],
      this.displayText[DateIndex.end],
    ];
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
    this.relativeMS[index] = 0;
    this.displayText[index] = this.localeObj.nowText;
    this.dateTypes[index] = DateType.relative;
  }
}
