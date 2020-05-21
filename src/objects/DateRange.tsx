import { DateRangeUI } from "./Types";
import { Locale } from "./Locale";
import { MSFormatter } from "./MSFormatter";

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
  dateRangeUI: DateRangeUI;
  localeObj: Locale;

  constructor(
    localeObj: Locale,
    dateRangeUI: DateRangeUI,
    storedRange?: string[] | null
  ) {
    this.localeObj = localeObj;
    this.dateRangeUI = dateRangeUI;
    this.setNow(DateIndex.start);
    this.setNow(DateIndex.end);
    this.applyChanges();
    storedRange ? this.loadFromStorage(storedRange) : () => {};
  }

  load(obj: DateRange): void {
    this.dates = obj.dates;
    this.displayText = obj.displayText;
    this.dateTypes = obj.dateTypes;
    this.finalDates = obj.finalDates;
    this.finalDisplayText = obj.finalDisplayText;
    this.relativeMS = obj.relativeMS;
  }

  loadFromStorage(data: string[]): void {
    let identifier = [data[0].slice(-1), data[1].slice(-1)];
    data = [data[0].slice(0, -1), data[1].slice(0, -1)];
    for (let p = 0; p < data.length; p++) {
      if (identifier[p] === "A") {
        let out = new Date(parseInt(data[p]));
        this.setDate(out, p);
      } else {
        this.setRelative(parseInt(data[p]), p);
      }
    }
    this.applyChanges();
  }

  setStoredRange(setStoredFn?: (dateRange: string[]) => void): void {
    if (setStoredFn) {
      let dates: string[] = [
        String(this.finalDates[0].getTime()),
        String(this.finalDates[1].getTime()),
      ];
      for (let i = 0; i < dates.length; i++) {
        if (this.isAbsolute(i)) {
          dates[i] = dates[i] + "A";
        } else {
          dates[i] = this.relativeMS[i] + "R";
        }
      }
      setStoredFn!(dates);
    }
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

  setDate(date: Date, index: number): void {
    this.dates[index] = date;
    this.displayText[index] =
      MSFormatter.formatAbsoluteDate(
        this.dates[index],
        this.localeObj.dateFormatter
      ) +
      " @ " +
      MSFormatter.formatAbsoluteTime(
        this.dates[index],
        this.localeObj.localeString
      );
    this.dateTypes[index] = DateType.absolute;
  }

  setUI() {
    for (let i = 0; i < this.dates.length; i++) {
      this.dateRangeUI.dateTextContent[i] = MSFormatter.formatAbsoluteDate(
        this.dates[i],
        this.localeObj.dateFormatter
      );
      this.dateRangeUI.timeTextContent[i] = MSFormatter.formatAbsoluteTime(
        this.dates[i],
        this.localeObj.localeString
      );
    }
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
  applyChanges(storedFn?: (dateRange: string[]) => void): void {
    this.refreshDates();
    this.finalDates = [this.dates[DateIndex.start], this.dates[DateIndex.end]];
    this.finalDisplayText = [
      this.displayText[DateIndex.start],
      this.displayText[DateIndex.end],
    ];
    this.setStoredRange(storedFn);
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
