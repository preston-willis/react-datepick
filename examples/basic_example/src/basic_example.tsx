import * as React from "react";
import * as ReactDOM from "react-dom";
import DateRangePicker from "../../../src/index";
import { BrowserRouter as Router, Route } from "react-router-dom";

const app = document.getElementById("app");

const DateRangeWithHistory: React.FC<{}> = () => {
  return (
    <DateRangePicker
      onDateEvent={(dateRange: Date[]) => console.log(dateRange)}
    />
  );
};

ReactDOM.render(
  <Router>
    <Route path="/">
      <DateRangeWithHistory />
    </Route>
  </Router>,
  app
);
