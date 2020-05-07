# React-DatePick
react-datepick can be used to pick a date range in react and specify a data refresh interval.
## Demo
![media](https://github.com/iamPres/react-datepick/blob/master/media/demo-1.PNG)
![media](https://github.com/iamPres/react-datepick/blob/master/media/demo-2.PNG)
![media](https://github.com/iamPres/react-datepick/blob/master/media/demo-3.PNG)
![media](https://github.com/iamPres/react-datepick/blob/master/media/demo-4.PNG)
## Dependencies
 - install the [package.json](https://github.com/iamPres/react-datepick/blob/master/package.json) dependencies with npm

## Example Usage
```javascript
import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import green from "@material-ui/core/colors/green";
import DatePick from "../src/index.tsx";

const app = document.getElementById("app");

function reset() {
  console.log("Reset!");
}

function getData(data) {
  console.log(data);
}

ReactDOM.render(
  <DatePick
    resetFn={reset}
    getData={getData}
  />,
  app
);

```

## Props
- `getData(data: Date[])`
  - Called every time the user chooses a date, takes a `Date[]` object
- `resetFn()`
  - Called when the refresh timer resets
- `dateFormatter` (optional)
  - Takes a `Intl.DateTimeFormat` object used to format displayed dates
  ```javascript
  dateFormatter={
      new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    }
  ```
- `theme` (optional)
  - Takes a materialUI `createMuiTheme()` object
  ```javascript
   theme={createMuiTheme({
      palette: {
        primary: purple,
        secondary: green,
      },
    })}
    ```
- `timeFormat` (optional `string`)
  - Takes a time-locale string format
  ```javascript
   timeFormat="en-US"
    ```
- `relativeTerms` (optional `string[]`)
  - Takes an array of 2 relative terms to be used in the relative date select dropdown menu
  ```javascript
   relativeTerms={["ago", "from now"]}
    ```
- `relativeIntervals` (optional `string[]`)
  - Takes an array of relative intervals to be used in the relative date select dropdown menu
  ```javascript
   relativeIntervals={["15 minutes", "1 hour"]}
    ```
- `quickSelectTerms` (optional `string[]`)
  - Takes an array of relative terms to be used in the quick select dropdown menu
  ```javascript
   quickSelectTerms={["ago", "from now"]}
   
- `quickSelectIntervals` (optional `string[]`)
  - Takes an array of relative intervals to be used in the quick select dropdown menu
  ```javascript
   quickSelectIntervals={["last", "next"]}
   
- `commonlyUsedText` (optional `string[]`)
  - Takes an array of relative intervals to be used in the quick select dropdown menu
  ```javascript
   commonlyUsedText={["last 20 minutes", "next 1 hour"]}
   
- `nowText` (optional `string`)
  - Takes a string to represent the displayed "now" text
  ```javascript
   nowText="ahora"
   ```
- `minimumYearValue` (optional `number`)
  - Takes a number to represent the minimum year to be chosen
  ```javascript
      maximumYearValue={100}
   ```
- `maximumYearValue` (optional `number`)
  - Takes a number to represent the maximum year to be chosen
  ```javascript
   maximumYearValue={2500}
   ```
- `getRawRange` (optional `((hist: History?) => Date[])`)
  - Takes a function with an optional `useHistory()` hook parameter, and a `Date[]` parameter. Can be used to store or parse data
  ```javascript
   getRawRange={(history: History): Date[] => {
      let persistedRange = history.location.hash.substring(1).split("=")[1];
      persistedRange = persistedRange.replace(/\%22/g, '"');
      console.log(persistedRange);
      let json = JSON.parse(persistedRange);

      return [new Date(json[0]), new Date(json[1])];
    }
   ```
- `setRawRange` (optional `((hist: History?, dates: Date[]) => void)`)
  - Takes a function that returns a `Date[]` object. Can be used to set date range data to preset or stored value
  ```javascript
   setRawRange={(range: Date[], history: History): void => {
      let json = JSON.stringify(range);
      history.replace("#range=" + json);
    }}

   ```
   
## Customization
 - Utilizes materialUI elements
 - Compatible with any materialUI `createMuiTheme()` object configuration
 - Add custom date formatters (11/2/2000 vs November 2, 2000)
 - Add custom menu text and preset time options
