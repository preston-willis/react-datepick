import React from "react";
import ReactDOM from "react-dom";
import DateRangePicker from "../../../src/index.tsx";
const humanize = require("humanize-duration");
import { useHistory } from "react-router-dom";

const app = document.getElementById("app");

function reset() {
  console.log("Reset!");
}

function getDateRange(data: Date[]): void {
  console.log(data);
}

ReactDOM.render(
  <DateRangePicker
    resetFn={reset}
    getDateRange={getDateRange}
    setRawRange={(range, history): void => {
      let json = JSON.stringify(range);
      history.replace("#range=" + json);
    }}
    getRawRange={(history) => {
      let json = [];
      let persistedRange = history.location.hash.substring(1).split("=")[1];
      if (persistedRange) {
        persistedRange = persistedRange.replace(/\%22/g, '"');
        setTimeout(() => {
          console.log(persistedRange);
        }, 500);
        json = JSON.parse(persistedRange);
      }
      return json;
    }}
  />,
  app
);
