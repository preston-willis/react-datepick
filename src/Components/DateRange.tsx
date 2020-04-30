import ms from "ms";

enum DateType {
  absolute = "absolute",
  relative = "relative",
}

export default class DateRange {
  dates: Date[];
  dateTypes: DateType[];
  displayText: string[];
  finalDates: Date[];
  finalDisplayText: string[];

  constructor() {
    this.dates = [new Date(), new Date()];
    this.displayText = ["now", "now"];
    this.dateTypes = [DateType.relative, DateType.relative];
    this.finalDates = [new Date(), new Date()];
    this.finalDisplayText = ["now", "now"];
  }

  load(obj) {
    this.dates = obj.dates;
    this.displayText = obj.displayText;
    this.dateTypes = obj.dateTypes;
    this.finalDates = obj.finalDates;
    this.finalDisplayText = obj.finalDisplayText;
  }

  setQuickSelect(text) {
    var quickSelectText = text;

    this.setNow(0);
    this.setNow(1);

    if (quickSelectText[0].includes("Next")) {
      this.dates[1].setTime(this.dates[0].getTime() + ms(quickSelectText[1]));
      this.displayText[0] = "now";
      this.displayText[1] = quickSelectText[1] + " from now";
    } else if (quickSelectText[0].includes("Last")) {
      this.dates[0].setTime(this.dates[0].getTime() - ms(quickSelectText[1]));
      this.displayText[0] = quickSelectText[1] + " ago";
      this.displayText[1] = "now";
    }
    this.dateTypes = [DateType.relative, DateType.relative];
  }

  static formatAbsoluteDate(date: Date) {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "numeric",
      day: "2-digit",
    }).format(date);
  }

  static formatAbsoluteTime(date: Date) {
    return date.toLocaleTimeString("en-US");
  }

  setDate(date, index) {
    this.dates[index] = date;
    this.displayText[index] =
      DateRange.formatAbsoluteDate(this.dates[index]) +
      " @ " +
      DateRange.formatAbsoluteTime(this.dates[index]);
    this.dateTypes[index] = DateType.absolute;
  }

  setRelative(text, index) {
    this.setNow(index);
    text = [text.split(" ").slice(0, 2).join(" "), text];
    if (text[1].includes("ago")) {
      this.dates[index].setTime(this.dates[index].getTime() - ms(text[0]));
    } else if (text[1].includes("from now")) {
      this.dates[index].setTime(this.dates[index].getTime() + ms(text[0]));
    }
    this.displayText[index] = text[1];
    this.dateTypes[index] = DateType.relative;
  }

  refreshDates() {
    var i = 0;
    for (i = 0; i < this.dates.length; i++) {
      if (!this.isAbsolute(i)) {
        this.setRelative(this.finalDisplayText[i], i);
      }
    }
  }

  applyChanges() {
    this.finalDates = [this.dates[0], this.dates[1]];
    this.finalDisplayText = [this.displayText[0], this.displayText[1]];
    this.refreshDates();
  }

  isAbsolute(index) {
    if (this.dateTypes[index] == DateType.absolute) {
      return true;
    } else {
      return false;
    }
  }
  setNow(index) {
    this.dates[index] = new Date();
    this.displayText[index] = "now";
    this.dateTypes[index] = DateType.relative;
  }
}
