import React from "react";
import { Layout } from "./Components/Layout";

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
  setStoredRange?(dateRange: string[]): void;
  storedRange: string[] | null;
}

export default function DatePick(props: Inputs) {
  return <Layout {...props} />;
}
