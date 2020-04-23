import React from "react";
import ReactDOM from "react-dom";
import DateRangePicker from "../../../src/index.tsx";

const app = document.getElementById("app");

function reset() {
  console.log("Reset!");
}

function getData(data) {
  console.log(data);
}

ReactDOM.render(
  <DateRangePicker resetFn={reset} getData={getData} />,
  app
);
