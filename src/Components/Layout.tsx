import React, { useState } from "react";
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
}

export function Layout(props: Inputs) {
  const [start, setStart] = useState(true);
  const [recentlySelected, setRecentlySelected] = useState([]);
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
  const [dateError, setDateError] = useState([false, false]);
  const [dateTextContents, setDateTextContents] = useState([
    formatDateforDisplay(0),
    formatDateforDisplay(1),
  ]);

  const toggleDropdown = (num) => {
    if (num != 1 && tabSelected != num) {
      if (boxClass == "box-closed") {
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

  function formatDateforDisplay(index) {
    var date = new Date(dates[index]);
    date.setDate(date.getDate());
    if (props.dateFormatter) {
      return props.dateFormatter.format(date);
    } else {
      return new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "numeric",
        day: "2-digit",
      }).format(date);
    }
  }

  function getMenuObj() {
    return {
      menuError: menuError,
      setMenuError: setMenuError,
      timerRunning: timerRunning,
      setTimerRunning: setTimerRunning,
      refreshInterval: refreshInterval,
      setRefreshInterval: setRefreshInterval,
      anchorEl: anchorEl,
      setAnchorEl: setAnchorEl,
      refreshIntervalUnits: refreshIntervalUnits,
      setRefreshIntervalUnits: setRefreshIntervalUnits,
      refreshIntervalEnabled: refreshIntervalEnabled,
      setRefreshIntervalEnabled: setRefreshIntervalEnabled,
      menuClass: menuClass,
    };
  }

  function getBodyObj(index) {
    return {
      daysInMonth: daysInMonth,
      setDaysInMonth: setDaysInMonth,
      propertySelected: propertySelected,
      setPropertySelected: setPropertySelected,
      boxClass: boxClass,
      setBoxClass: setBoxClass,
      index: index,
      dates: dates,
      setDates: setDates,
      dateError: dateError,
      setDateError: setDateError,
      dateTextContents: dateTextContents,
      setDateTextContents: setDateTextContents,
      getData: props.getData,
      formatDateforDisplay: formatDateforDisplay,
    };
  }

  function getQuickSelectObj() {
    return {
      boxClass: boxClass,
      recentlySelected: recentlySelected,
      setRecentlySelected: setRecentlySelected,
      setDates: setDates,
      setQuickSelectText: setQuickSelectText,
      quickSelectText: quickSelectText,
      setTermAnchorEl: setTermAnchorEl,
      termAnchorEl: termAnchorEl,
      setIntervalAnchorEl: setIntervalAnchorEl,
      intervalAnchorEl: intervalAnchorEl,
    };
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
                  />
                </Button>
              </Box>
            </Tab>
            <Tab>
              <Box ml={2}>
                <Button color="primary" variant="text" className="header-title">
                  {formatDateforDisplay(0) +
                    " @ " +
                    dates[0].toLocaleTimeString("en-US")}
                </Button>
              </Box>
            </Tab>
            <span>&#10230;</span>
            <Tab>
              <Button color="primary" variant="text" className="header-title2">
                {formatDateforDisplay(1) +
                  " @ " +
                  dates[1].toLocaleTimeString("en-US")}
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
            <Body {...getBodyObj(0)} />
          </TabPanel>
          <TabPanel>
            <Body {...getBodyObj(1)} />
          </TabPanel>
        </Tabs>
      </div>
    </MuiThemeProvider>
  );
}
