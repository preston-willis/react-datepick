import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Layout } from "./Components/Layout.tsx";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

interface Inputs {
  getDateRange(dates: Date[]): void;
  resetFn(): void;
  dateFormatter?: Intl.DateTimeFormat;
  theme?: any;
  commonlyUsedText?: number[];
  quickSelectTerms?: string[];
  quickSelectIntervals?: number[];
  relativeTerms?: string[];
  relativeIntervals?: number[];
  timeFormat?: string;
  nowText?: string;
  minimumYearValue?: number;
  maximumYearValue?: number;
  humanizer?: any;
  setRawRange?(dateRange, history): void;
  getRawRange?(history): Date[];
}

export default function DatePick(props: Inputs) {
  return (
    <Router>
      <Route path="/">
        <Layout {...props} />{" "}
      </Route>
    </Router>
  );
}
