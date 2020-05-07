import React from "react";
import ReactDOM from "react-dom";
import DateRangePicker from "../../../src/index.tsx";
import { useHistory } from "react-router-dom";

const persistRange = (range: Date[], history): void => {
  let json = JSON.stringify(range);
  history.replace("#range=" + json);
};

const getPersistRange = (history): Date[] => {
  let persistedRange = history.location.hash.substring(1).split("=")[1];
  persistedRange = persistedRange.replace(/\%22/g, '"');
  console.log(persistedRange);
  let json = JSON.parse(persistedRange)

  return [new Date(json[0]), new Date(json[1])];
};

const app = document.getElementById("app");

function reset() {
  console.log("Reset!");
}

function getDateRange(data: Date[]): void {
  console.log(data);
}

ReactDOM.render(
  <DateRangePicker
    timeFormat="ja"
    resetFn={reset}
    getDateRange={getDateRange}
    setRawRange={persistRange}
    getRawRange={getPersistRange}
  />,
  app
);
