import React from "react";
import ReactDOM from "react-dom";
import { createMuiTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import green from "@material-ui/core/colors/green";
import DateRangePicker from "react-datepick";

const app = document.getElementById("app");

function getDateRange(data: Date[]) {
  console.log(data);
}

ReactDOM.render(
  <DateRangePicker
    resetFn={() => {
      console.log("reset");
    }}
    getDateRange={getDateRange}
    dateFormatter={
      new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    }
    theme={createMuiTheme({
      palette: {
        primary: purple,
        secondary: green,
      },
    })}
  />,
  app
);
