import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  GridList,
  GridListTile,
  TextField,
  Grid,
} from "@material-ui/core";
import {
  format,
  formatDistance,
  formatRelative,
  subDays,
  getMonth,
  getDay,
  getYear,
} from "date-fns";
import DateRange from "./DateRange.tsx";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Timer from "react-compound-timer";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Body } from "./Body.tsx";
import { MenuView } from "./Menu.tsx";
import { TimerUI } from "./Timer.tsx";
import { QuickSelect } from "./QuickSelect.tsx";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import KeyboardTabIcon from "@material-ui/icons/KeyboardTab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RefreshIcon from "@material-ui/icons/Refresh";
import "./Styling.css";

interface Inputs {
  resetFn(): void;
  getData(x): void;
  dateFormatter?: Intl.DateTimeFormat;
  theme?: any;
  timeIntervalText?: string[][];
  timeFormat?: string;
}

var timeFormat: string = "en-US";

export function Layout(props: Inputs) {
  // DATES
  const [propertySelected, setPropertySelected] = useState(-1);
  const [daysInMonth, setDaysInMonth] = useState([
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(),
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(),
  ]);
  const [dateRange, setDateRange] = useState(new DateRange());

  // TAB LOGIC
  const [tabSelected, setTabSelected] = useState(-1);
  const [bodySubTabIndex, setBodySubTabIndex] = useState(0);

  // DROPDOWN DATA
  const [termAnchorEl, setTermAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [intervalAnchorEl, setIntervalAnchorEl] = useState(null);
  const [quickSelectContent, setQuickSelectContent] = useState([
    "Last",
    "15 minutes",
  ]);
  const [relativeSelectContent, setRelativeSelectContent] = useState([
    "15 minutes",
    "ago",
  ]);

  // QUICK SELECT
  const [recentlySelected, setRecentlySelected] = useState([[]]);

  // TEXT FIELD INPUT
  const [dateTextContents, setDateTextContents] = useState([
    DateRange.formatAbsoluteDate(new Date()),
    DateRange.formatAbsoluteDate(new Date()),
  ]);
  const [timeTextContents, setTimeTextContents] = useState([
    new Date().toLocaleTimeString(timeFormat),
    new Date().toLocaleTimeString(timeFormat),
  ]);

  // STYLING
  const [menuClass, setMenuClass] = useState("menu-closed");
  const [boxClass, setBoxClass] = useState("box-closed");

  // TIMER
  const [refreshIntervalUnits, setRefreshIntervalUnits] = useState("Minutes");
  const [refreshInterval, setRefreshInterval] = useState(-1);
  const [refreshIntervalEnabled, setRefreshIntervalEnabled] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);

  // TEXT FIELD ERRORS
  const [menuError, setMenuError] = useState(false);
  const [dateError, setDateError] = useState([false, false]);
  const [timeError, setTimeError] = useState([false, false]);

  var timeIntervalText: string[][] = [
    ["Last", "15 Minutes"],
    ["Last", "30 Minutes"],
    ["Last", "1 Hour"],
    ["Last", "24 hours"],
    ["Last", "7 days"],
    ["Last", "30 days"],
    ["Last", "90 days"],
    ["Last", "1 year"],
  ];
  var dateFormatter = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "numeric",
    day: "2-digit",
  });

  useEffect(() => {
    if (props.timeFormat) {
      timeFormat = props.timeFormat;
    }
    if (props.timeIntervalText) {
      timeIntervalText = props.timeIntervalText;
    }
    if (props.dateFormatter) {
      dateFormatter = props.dateFormatter;
    }
  }, []);

  const toggleDropdown = (num) => {
    if (num != 1 && tabSelected != num) {
      if (boxClass == "box-closed" || boxClass == "box-tiny") {
        setBoxClass("box");
        setMenuClass("menu-closed");
      }
      setTabSelected(num);
    } else if (tabSelected == num) {
      if (boxClass == "box-closed") {
        setBoxClass("box");
        setMenuClass("menu-closed");
      } else {
        setBoxClass("box-closed");
      }
    }
    if (num == 1) {
      if (menuClass == "menu-closed") {
        setMenuClass("menu");
        setBoxClass("box-closed");
        setTabSelected(num);
      } else {
        setMenuClass("menu-closed");
      }
    }
  };

  function getMenuObj() {
    return {
      menuError,
      setMenuError,
      timerRunning,
      setTimerRunning,
      refreshInterval,
      setRefreshInterval,
      anchorEl,
      setAnchorEl,
      refreshIntervalUnits,
      setRefreshIntervalUnits,
      refreshIntervalEnabled,
      setRefreshIntervalEnabled,
      menuClass,
    };
  }

  function getBodyObj(index) {
    return {
      relativeSelectContent,
      setRelativeSelectContent,
      daysInMonth,
      setDaysInMonth,
      propertySelected,
      setPropertySelected,
      boxClass,
      setBoxClass,
      index,
      timeTextContents,
      setTimeTextContents,
      setDateTextContents,
      dateTextContents,
      dateError,
      setDateError,
      timeError,
      setTimeError,
      timeFormat,
      bodySubTabIndex,
      setBodySubTabIndex,
      dateFormatter,
      dateRange,
      setDateRange: resetDateRange,
    };
  }

  function getQuickSelectObj() {
    return {
      dateRange,
      applyChanges,
      quickSelectContent,
      setQuickSelectContent,
      setDateRange: resetDateRange,
      boxClass,
      recentlySelected,
      setRecentlySelected,
      setTermAnchorEl,
      termAnchorEl,
      setIntervalAnchorEl,
      intervalAnchorEl,
      getData: props.getData,
      timeIntervalText,
      timeFormat,
    };
  }

  function getDateSelectObj() {
    return {
      termAnchorEl,
      intervalAnchorEl,
      timeIntervalText,
      setTermAnchorEl,
      setIntervalAnchorEl,
    };
  }

  function resetDateRange(previous) {
    var newObject = new DateRange();
    newObject.load(previous);
    setDateRange(newObject);
  }

  function applyChanges() {
    dateRange.applyChanges();
    resetDateRange(dateRange);
    console.log("DATE APPLIED: " + dateRange.finalDisplayText);

    props.getData(dateRange.dates);

    if (timerRunning) {
      setTimerRunning(false);
    }
  }

  function refreshTime() {
    dateRange.refreshDates();
    resetDateRange(dateRange);

    props.getData(dateRange);
    setTimerRunning(false);
    setTimerRunning(true);
  }

  function getApplyText() {
    if (timerRunning) {
      return (
        <Box style={{ display: "flex", flexDirection: "row" }}>
          <RefreshIcon />
          <Box ml={1} />
          Refresh
        </Box>
      );
    } else {
      return (
        <Box style={{ display: "flex", flexDirection: "row" }}>
          <KeyboardTabIcon />
          <Box ml={1} />
          Update
        </Box>
      );
    }
  }

  const theme = createMuiTheme({
    typography: {
      subtitle1: {
        fontSize: 16,
        fontWeight: 600,
      },
      subtitle2: {
        color: "primary",
      },
      button: {
        fontWeight: 500,
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <div className="layout">
        <Tabs onSelect={(index) => toggleDropdown(index)}>
          <TabList className="header">
            <Tab>
              <Button
                color="primary"
                variant="contained"
                style={{
                  minHeight: "35px",
                  maxHeight: "35px",
                  minWidth: "80px",
                  maxWidth: "80px",
                }}
              >
                <CalendarTodayIcon />
                <ExpandMoreIcon />
              </Button>
            </Tab>
            <Tab>
              <Box ml={1}>
                <Button
                  color="primary"
                  variant="contained"
                  className="header-button"
                  style={{
                    minHeight: "35px",
                    maxHeight: "35px",
                    minWidth: "80px",
                    maxWidth: "80px",
                  }}
                >
                  <TimerUI
                    timerRunning={timerRunning}
                    refreshInterval={refreshInterval}
                    refreshIntervalUnits={refreshIntervalUnits}
                    resetFn={props.resetFn}
                    applyFn={refreshTime}
                  />
                </Button>
              </Box>
            </Tab>
            <Box ml={1}>
              <Button
                onClick={() => applyChanges()}
                variant="contained"
                color="primary"
                style={{
                  maxWidth: "150px",
                  minWidth: "150px",
                  maxHeight: "35px",
                  minHeight: "35px",
                }}
              >
                {getApplyText()}
              </Button>
            </Box>
            <Tab>
              <Box ml={2}>
                <Button color="primary" variant="text" className="header-title">
                  {dateRange.finalDisplayText[0]}
                </Button>
              </Box>
            </Tab>
            <span>&#10230;</span>
            <Tab>
              <Button color="primary" variant="text" className="header-title2">
                {dateRange.finalDisplayText[1]}
              </Button>
            </Tab>
          </TabList>
          <TabPanel>
            <QuickSelect {...getQuickSelectObj()} />
          </TabPanel>
          <TabPanel>
            <MenuView {...getMenuObj()} />
          </TabPanel>
          <TabPanel>
            <Body {...getBodyObj(0)} {...getDateSelectObj()} />
          </TabPanel>
          <TabPanel>
            <Body {...getBodyObj(1)} {...getDateSelectObj()} />
          </TabPanel>
        </Tabs>
      </div>
    </MuiThemeProvider>
  );
}
