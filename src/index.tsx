import React from "react";
import { Layout } from "./components/Layout";
import { OptionalLocale } from "./objects/Locale";

interface Inputs {
  onDateEvent(dates: Date[]): void;
  onTimerEvent(): void;
  theme?: any;
  commonlyUsedText?: number[];
  quickSelectIntervals?: number[];
  relativeIntervals?: number[];
  minimumYearValue?: number;
  maximumYearValue?: number;
  setStoredRange?(dateRange: string[]): void;
  storedRange: string[] | null;
  localeObj: OptionalLocale;
}

export default function DatePick(props: Inputs) {
  return <Layout {...props} />;
}
