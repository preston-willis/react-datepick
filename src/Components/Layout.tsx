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
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Timer from "react-compound-timer";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Body } from "./Body.tsx";
import { MenuView } from "./Menu.tsx";
import { TimerUI } from "./Timer.tsx";
import { QuickSelect } from "./QuickSelect.tsx";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import "./Styling.css";

interface Inputs {
  resetFn(): void;
  getData(x): void;
  dateFormatter?: Intl.DateTimeFormat;
  theme?: any;
  timeIntervalText?: string[][];
  timeFormat?: string;
}

export function Layout(props: Inputs) {
  const [resetDateOnRefresh, setResetDateOnRefresh] = useState([false, false]);
  const [displayedDate, setDisplayedDate] = useState([new Date(), new Date()]);
  const [recentlySelected, setRecentlySelected] = useState([[]]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [termAnchorEl, setTermAnchorEl] = useState(null);
  const [intervalAnchorEl, setIntervalAnchorEl] = useState(null);
  const [quickSelectText, setQuickSelectText] = useState([
    "last",
    "15 minutes",
  ]);
  const [refreshIntervalUnits, setRefreshIntervalUnits] = useState("Minutes");
  const [tabSelected, setTabSelected] = useState(-1);
  const [propertySelected, setPropertySelected] = useState(-1);

  const [menuClass, setMenuClass] = useState("menu-closed");
  const [boxClass, setBoxClass] = useState("box-closed");
  const [refreshInterval, setRefreshInterval] = useState(-1);
  const [refreshIntervalEnabled, setRefreshIntervalEnabled] = useState(false);
  const [dates, setDates] = useState([new Date(), new Date()]);
  const [daysInMonth, setDaysInMonth] = useState([
    new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate(),
    new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate(),
  ]);
  const [timerRunning, setTimerRunning] = useState(false);
  const [menuError, setMenuError] = useState(false);
  const [bodySubTabIndex, setBodySubTabIndex] = useState(0);
  const [dateError, setDateError] = useState([false, false]);
  const [timeError, setTimeError] = useState([false, false]);
  const [dateTextContents, setDateTextContents] = useState([
    formatDateForDisplay(0),
    formatDateForDisplay(1),
  ]);
  var timeFormat: string = "en-US";
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
  const [timeTextContents, setTimeTextContents] = useState([
    new Date().toLocaleTimeString(timeFormat),
    new Date().toLocaleTimeString(timeFormat),
  ]);

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

  function formatDateForDisplay(index) {
    var date = new Date(displayedDate[index]);
    date.setDate(date.getDate());
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "numeric",
      day: "2-digit",
    }).format(date);
  }

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
      daysInMonth,
      setDaysInMonth,
      propertySelected,
      setPropertySelected,
      boxClass,
      setBoxClass,
      index,
      dates,
      setDates,
      dateError,
      setDateError,
      dateTextContents,
      setDateTextContents,
      formatDateForDisplay,
      timeError,
      setTimeError,
      timeTextContents,
      setTimeTextContents,
      timeFormat,
      bodySubTabIndex,
      setBodySubTabIndex,
      resetDateOnRefresh,
      setResetDateOnRefresh,
      dateFormatter,
    };
  }

  function getQuickSelectObj() {
    return {
      boxClass,
      recentlySelected,
      setRecentlySelected,
      setDates,
      setQuickSelectText,
      quickSelectText,
      setTermAnchorEl,
      termAnchorEl,
      setIntervalAnchorEl,
      intervalAnchorEl,
      getData: props.getData,
      dates,
      setTimeTextContents,
      setDateTextContents,
      formatDateForDisplay,
      dateTextContents,
      timeIntervalText,
      timeFormat,
      setDisplayedDate,
    };
  }

  function getDateSelectObj() {
    return {
      quickSelectText,
      termAnchorEl,
      intervalAnchorEl,
      timeIntervalText,
      setTermAnchorEl,
      setIntervalAnchorEl,
      setQuickSelectText,
    };
  }

  function applyChanges() {
    props.getData(dates);
    setDisplayedDate(dates);
  }

  return (
    <MuiThemeProvider theme={props.theme}>
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
                  minWidth: "35px",
                  maxWidth: "35px",
                }}
              >
                <CalendarTodayIcon />
              </Button>
            </Tab>
            <Tab>
              <Box ml={1}>
                <Button
                  color="primary"
                  variant="contained"
                  className="header-button"
                >
                  <TimerUI
                    timerRunning={timerRunning}
                    refreshInterval={refreshInterval}
                    refreshIntervalUnits={refreshIntervalUnits}
                    resetFn={props.resetFn}
                    setTimerRunning={setTimerRunning}
                    dates={dates}
                    setDates={setDates}
                    resetDateOnRefresh={resetDateOnRefresh}
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
                  maxWidth: "80px",
                  minWidth: "80px",
                  maxHeight: "35px",
                  minHeight: "35px",
                }}
              >
                Apply
              </Button>
            </Box>
            <Tab>
              <Box ml={2}>
                <Button color="primary" variant="text" className="header-title">
                  {formatDateForDisplay(0) +
                    " @ " +
                    displayedDate[0].toLocaleTimeString(timeFormat)}
                </Button>
              </Box>
            </Tab>
            <span>&#10230;</span>
            <Tab>
              <Button color="primary" variant="text" className="header-title2">
                {formatDateForDisplay(1) +
                  " @ " +
                  displayedDate[1].toLocaleTimeString(timeFormat)}
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
