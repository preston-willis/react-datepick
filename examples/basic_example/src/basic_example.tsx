import React from "react";
import ReactDOM from "react-dom";
import DateRangePicker from "../../../src/index.tsx";

const app = document.getElementById("app");

function reset() {
  console.log("Reset!");
}

function getDateRange(data: Date[]): void {
  console.log(data);
}

ReactDOM.render(<DateRangePicker relativeTerms={["ago", "from now"]} resetFn={reset} getDateRange={getDateRange} />, app);
