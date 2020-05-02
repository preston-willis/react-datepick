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

  constructor() {
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

    if (quickSelectText[0].includes("Next")) {
      this.dates[DateIndex.end].setTime(
        this.dates[DateIndex.start].getTime() + ms(quickSelectText[1])
      );
      this.displayText[DateIndex.start] = "now";
      this.displayText[DateIndex.end] = quickSelectText[1] + " from now";
    } else if (quickSelectText[0].includes("Last")) {
      this.dates[DateIndex.start].setTime(
        this.dates[DateIndex.start].getTime() - ms(quickSelectText[1])
      );
      this.displayText[DateIndex.start] = quickSelectText[1] + " ago";
      this.displayText[DateIndex.end] = "now";
    }
    this.dateTypes = [DateType.relative, DateType.relative];
  }

  static formatAbsoluteDate(date: Date): string {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "numeric",
      day: "2-digit",
    }).format(date);
  }

  static formatAbsoluteTime(date: Date): String {
    return date.toLocaleTimeString("en-US");
  }

  setDate(date: Date, index: number): void {
    this.dates[index] = date;
    this.displayText[index] =
      DateRange.formatAbsoluteDate(this.dates[index]) +
      " @ " +
      DateRange.formatAbsoluteTime(this.dates[index]);
    this.dateTypes[index] = DateType.absolute;
  }

  setRelative(text: string, index: number): void {
    this.setNow(index);
    const textParts = [text.split(" ").slice(0, 2).join(" "), text];
    if (textParts[1].includes("ago")) {
      this.dates[index].setTime(this.dates[index].getTime() - ms(textParts[0]));
    } else if (textParts[1].includes("from now")) {
      this.dates[index].setTime(this.dates[index].getTime() + ms(textParts[0]));
    }
    this.displayText[index] = textParts[1];
    this.dateTypes[index] = DateType.relative;
  }

  refreshDates(): void {
    var i = 0;
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
    this.displayText[index] = "now";
    this.dateTypes[index] = DateType.relative;
  }
}
