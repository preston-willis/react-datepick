import React from "react";
import ReactDOM from "react-dom";
import DateRangePicker from "react-datepick";
import { useHistory } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

const app = document.getElementById("app");

function reset() {
  console.log("Reset!");
}

function getDateRange(data: Date[]): void {
  console.log(data);
}

interface Inputs {}

const DateRangeWithHistory: React.FC<Inputs> = props => {
  const history = useHistory();

  // Set the persisted range into the URL
  const persistRange = (range: string[]): void => {
    history.replace("#range=" + encodeURIComponent(JSON.stringify(range)));
  };

  // Get the persisted range out of the URL
  const getRange = (): string[] | null => {
    let range = null;
    try {
      range = JSON.parse(decodeURIComponent(history.location.hash.substring(1).split("=")[1]));
    } catch {
      return null;
    }
    return range;
  };

  return (
    <DateRangePicker
      timeFormat="fr"
      resetFn={() => {
        console.log("reset");
      }}
      getDateRange={getDateRange}
      setStoredRange={persistRange}
      storedRange={getRange()}
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
