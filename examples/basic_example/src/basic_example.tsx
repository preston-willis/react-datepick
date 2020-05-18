import * as React from "react";
import * as ReactDOM from "react-dom";
import DateRangePicker from "react-datepick";
import { useHistory } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

const app = document.getElementById("app");

const DateRangeWithHistory: React.FC<{}> = () => {
  const history = useHistory();

  // Set the persisted range into the URL
  const persistRange = (range: string[]): void => {
    history.replace("#range=" + encodeURIComponent(JSON.stringify(range)));
  };

  // Get the persisted range out of the URL
  const getRange = (): string[] | null => {
    let range = null;
    try {
      range = JSON.parse(
        decodeURIComponent(history.location.hash.substring(1).split("=")[1])
      );
    } catch {
      return null;
    }
    return range;
  };

  return (
    <DateRangePicker
      localeString="fr"
      onTimerEvent={() => {
        console.log("reset");
      }}
      onDateEvent={(dateRange: Date[]) => console.log(dateRange)}
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
