import React from "react";
import ms from "ms";
var locale = require("browser-locale")();
import humanize from "humanize-duration";
import { Locale } from "./Types";
import { createMuiTheme } from "@material-ui/core/styles";

interface Constants {
  classes: any;
  commonlyUsedText: number[];
  quickSelectIntervals: number[];
  relativeIntervals: number[];
  theme: any;
  minimumYearValue: number;
  maximumYearValue: number;
  localeObj: Locale;
}

export const GlobalContext: React.Context<Constants> = React.createContext({
  classes: null,

  commonlyUsedText: [
    -ms("15 Minutes"),
    -ms("30 Minutes"),
    -ms("1 Hour"),
    -ms("24 hours"),
    -ms("7 days"),
    -ms("30 days"),
    -ms("90 days"),
    -ms("1 year"),
  ],

  quickSelectIntervals: [
    ms("1 minute"),
    ms("15 minutes"),
    ms("30 minutes"),
    ms("1 hour"),
    ms("6 hours"),
    ms("12 hours"),
    ms("1 day"),
    ms("7 days"),
    ms("30 days"),
    ms("90 days"),
    ms("1 year"),
  ],

  relativeIntervals: [
    ms("1 minute"),
    ms("15 minutes"),
    ms("30 minutes"),
    ms("1 hour"),
    ms("6 hours"),
    ms("12 hours"),
    ms("1 day"),
    ms("7 days"),
    ms("30 days"),
    ms("90 days"),
    ms("1 year"),
  ],

  theme: createMuiTheme({
    typography: {
      subtitle1: {
        fontSize: 16,
        fontWeight: 600,
      },
      subtitle2: {
        color: "primary",
      },
      button: {
        fontWeight: 500,
      },
    },
  }),

  minimumYearValue: 100,
  maximumYearValue: 3000,

  localeObj: {
    nowText: "now",
    relativeTerms: ["ago", "from now"],
    dateFormatter: new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "numeric",
      day: "2-digit",
    }),
    quickSelectTerms: ["Last", "Next"],
    localeString: locale.slice(0, 2),
    humanizer: humanize.humanizer({
      language: locale.slice(0, 2),
    }),
  },
});
