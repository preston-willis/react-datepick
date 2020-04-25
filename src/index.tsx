import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Layout } from "./Components/Layout.tsx";

interface Inputs {
  getData(a): void;
  resetFn(): void;
  dateFormatter?: Intl.DateTimeFormat;
  theme?: any;
  timeIntervalText?: string[][];
  timeFormat?: string;
}

export default function DatePick(props: Inputs) {
  return <Layout {...props} />;
}
