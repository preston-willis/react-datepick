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
  timeIntervalText?: string[][];
  quickSelectTerms?: string[];
  quickSelectIntervals?: string[];
  relativeTerms?: string[];
  relativeIntervals?: string[];
  timeFormat?: string;
  nowText?: string;
  minimumYearValue?: number;
  maximumYearValue?: number;
  setRawRange?(dateRange: Date[], history): void;
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
