import { TermContext } from "./DateRange";
import { Locale } from "./Types";

export class MSFormatter {
  static formatAbsoluteDate(
    date: Date,
    dateFormatter: Intl.DateTimeFormat
  ): string {
    return dateFormatter.format(date);
  }

  static formatAbsoluteTime(date: Date, localeString: string): string {
    return date.toLocaleTimeString(localeString);
  }

  static splitMilliseconds(ms: number): number[] {
    let out = [-1, 0];
    out[1] = Math.abs(ms);
    if (ms >= 0) {
      out[0] = 1;
    }

    return out;
  }

  static multiplierToHumanized(
    mult: number,
    type: TermContext,
    localeObj: Locale
  ): string {
    let out = "";
    let terms = localeObj.relativeTerms;
    if (type == TermContext.quickSelect) {
      terms = localeObj.quickSelectTerms;
    }
    if (mult == -1) {
      out = terms[0];
    } else {
      out = terms[1];
    }
    return out;
  }

  static millisecondsToHumanized(
    array: number[],
    type: TermContext,
    localeObj: Locale
  ): string[] {
    let out = ["", ""];
    out[0] = MSFormatter.multiplierToHumanized(array[0], type, localeObj);
    if (array[1] != 0) {
      out[1] = localeObj.humanizer(Math.abs(array[1]));
    } else {
      out[1] = localeObj.nowText;
    }
    return out;
  }
}
