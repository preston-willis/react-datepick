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
import { makeStyles } from "@material-ui/styles";
import "./Styling.css";

interface Inputs {
  resetFn(): void;
  getDateRange(dates: Date[]): void;
  dateFormatter?: Intl.DateTimeFormat;
  theme?: any;
  commonlyUsedText?: string[][];
  quickSelectTerms?: string[];
  quickSelectIntervals?: string[];
  relativeTerms?: string[];
  relativeIntervals?: string[];
  timeFormat?: string;
  nowText?: string;
  minimumYearValue?: number;
  maximumYearValue?: number;
}

const commonlyUsedTextDefault: string[][] = [
  ["Last", "15 Minutes"],
  ["Last", "30 Minutes"],
  ["Last", "1 Hour"],
  ["Last", "24 hours"],
  ["Last", "7 days"],
  ["Last", "30 days"],
  ["Last", "90 days"],
  ["Last", "1 year"],
];

const quickSelectTermsDefault: string[] = ["Last", "Next"];

const timeFormatDefault: string = "en-US";

const quickSelectIntervalsDefault: string[] = [
  "1 minute",
  "15 minutes",
  "30 minutes",
  "1 hour",
  "6 hours",
  "12 hours",
  "1 day",
  "7 days",
  "30 days",
  "90 days",
  "1 year",
];

const relativeTermsDefault: string[] = ["ago", "from now"];

const dateFormatterDefault: Intl.DateTimeFormat = new Intl.DateTimeFormat(
  "en",
  {
    year: "numeric",
    month: "numeric",
    day: "2-digit",
  }
);

const themeDefault: any = createMuiTheme({
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

const nowTextDefault: string = "now";

const minimumYearValueDefault: number = 100;

const maximumYearValueDefault: number = 3000;

export const Layout: React.FC<Inputs> = (props) => {
  // OPTIONAL
  const timeFormat: string = props.timeFormat || timeFormatDefault;

  const commonlyUsedText: string[][] =
    props.commonlyUsedText || commonlyUsedTextDefault;

  const quickSelectTerms: string[] =
    props.quickSelectTerms || quickSelectTermsDefault;

  const quickSelectIntervals: string[] =
    props.quickSelectIntervals || quickSelectIntervalsDefault;

  const relativeIntervals: string[] =
    props.relativeIntervals || quickSelectIntervalsDefault;

  const relativeTerms: string[] = props.relativeTerms || relativeTermsDefault;

  const nowText: string = props.nowText || nowTextDefault;

  const dateFormatter: Intl.DateTimeFormat =
    props.dateFormatter || dateFormatterDefault;

  const theme: any = props.theme || themeDefault;

  const minimumYearValue: number =
    props.minimumYearValue || minimumYearValueDefault;

  const maximumYearValue: number =
    props.maximumYearValue || maximumYearValueDefault;

  const localeObj = {
    quickSelectTerms,
    quickSelectIntervals,
    relativeTerms,
    relativeIntervals,
    nowText,
  };

  // DATES
  const [propertySelected, setPropertySelected] = useState<number>(-1);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(),
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(),
  ]);
  const [dateRange, setDateRange] = useState<DateRange>(
    new DateRange(localeObj)
  );

  // TAB LOGIC
  const [tabSelected, setTabSelected] = useState<number>(-1);
  const [bodySubTabIndex, setBodySubTabIndex] = useState<number>(0);

  // DROPDOWN DATA
  const [termAnchorEl, setTermAnchorEl] = useState<EventTarget | null>(null);
  const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);
  const [intervalAnchorEl, setIntervalAnchorEl] = useState<EventTarget | null>(
    null
  );
  const [quickSelectContent, setQuickSelectContent] = useState<string[]>([
    quickSelectTerms[0],
    quickSelectIntervals[0],
  ]);
  const [relativeSelectContent, setRelativeSelectContent] = useState<string[]>([
    relativeIntervals[0],
    relativeTerms[0],
  ]);

  // QUICK SELECT
  const [recentlySelected, setRecentlySelected] = useState<string[][]>([[""]]);

  // TEXT FIELD INPUT
  const [dateTextContents, setDateTextContents] = useState<string[]>([
    DateRange.formatAbsoluteDate(new Date(), dateFormatter),
    DateRange.formatAbsoluteDate(new Date(), dateFormatter),
  ]);
  const [timeTextContents, setTimeTextContents] = useState<string[]>([
    new Date().toLocaleTimeString(timeFormat),
    new Date().toLocaleTimeString(timeFormat),
  ]);

  // STYLING
  const [menuClass, setMenuClass] = useState<string>("menu-closed");
  const [boxClass, setBoxClass] = useState<string>("box-closed");

  // TIMER
  const [refreshIntervalUnits, setRefreshIntervalUnits] = useState<string>(
    "Minutes"
  );
  const [refreshInterval, setRefreshInterval] = useState<number>(-1);
  const [refreshIntervalEnabled, setRefreshIntervalEnabled] = useState<boolean>(
    false
  );
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // TEXT FIELD ERRORS
  const [menuError, setMenuError] = useState<boolean>(false);
  const [dateError, setDateError] = useState<boolean[]>([false, false]);
  const [timeError, setTimeError] = useState<boolean[]>([false, false]);

  const useStyles = makeStyles((theme) => ({
    layout: {
      width: "600px",
      height: "600px",
    },
    flexRow: {
      display: "flex",
      flexDirection: "row",
    },
    flexColumn: {
      display: "flex",
      flexDirection: "column",
    },
    headerIconButton: {
      minHeight: "35px",
      maxHeight: "35px",
      minWidth: "80px",
      maxWidth: "80px",
    },
    headerApplyButton: {
      minHeight: "35px",
      maxHeight: "35px",
      minWidth: "150px",
      maxWidth: "150px",
    },
    bodyHeader: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    bodyList: {
      maxWidth: "100px",
      maxHeight: "30px",
      minWidth: "100px",
      minHeight: "30px",
    },
    bodyListContainer: {
      overflow: "auto",
      maxHeight: 350,
      maxWidth: 120,
    },
    bodyTabButton: {
      minHeight: "35px",
      maxHeight: "35px",
      minWidth: "100px",
      maxWidth: "100px",
    },
    bodytabList: {
      width: "400px",
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      listStyle: "none",
      height: "25px",
    },
    bodyTabHeader: { height: "10px" },
    bodyAbsoluteTab: {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      width: "400px",
    },
    calendarButton: {
      maxWidth: "30px",
      maxHeight: "30px",
      minWidth: "30px",
      minHeight: "30px",
    },
    calendar: {
      maxWidth: "300px",
      maxHeight: "200px",
      minWidth: "300px",
      minHeight: "200px",
    },
    bodyTextField: {
      width: 125,
    },
    bodyDateSelectDropdown: {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      width: "400px",
      height: "225px",
    },
    bodyDateSelectDropdownButton: {
      maxHeight: "40px",
      minHeight: "40px",
    },
    bodySetNow: {
      width: "300px",
    },
    bodySetNowButton: { width: "200px", height: "40px" },
    quickSelectApplyButton: {
      maxWidth: "80px",
      minWidth: "80px",
      maxHeight: "40px",
      minHeight: "40px",
    },
    quickSelectContainerButton: {
      backgroundColor: "transparent",
      maxWidth: "150px",
      minWidth: "150px",
      maxHeight: "30px",
      minHeight: "30px",
    },
    menuTimerStateButton: {
      maxHeight: "40px",
      minHeight: "40px",
      maxWidth: "80px",
      minWidth: "80px",
    },
    menuEnableButton: {
      maxHeight: "40px",
      minHeight: "40px",
    },
    menuTimerButtonsContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "left",
        width: "400px",
    },
  }));

  let classes = useStyles();

  const toggleDropdown = (num: number): void => {
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
      classes,
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

  function getBodyObj(index: number) {
    return {
      relativeSelectContent,
      setRelativeSelectContent,
      classes,
      daysInMonth,
      setDaysInMonth,
      propertySelected,
      setPropertySelected,
      boxClass,
      setBoxClass,
      index,
      minimumYearValue,
      maximumYearValue,
      timeTextContents,
      setTimeTextContents,
      setDateTextContents,
      dateTextContents,
      dateError,
      setDateError,
      formatDateTextField,
      formatTimeTextField,
      timeError,
      setTimeError,
      timeFormat,
      bodySubTabIndex,
      setBodySubTabIndex,
      dateFormatter,
      dateRange,
      relativeTerms,
      relativeIntervals,
      setDateRange: resetDateRange,
    };
  }

  function getQuickSelectObj() {
    return {
      dateRange,
      classes,
      applyChanges,
      quickSelectContent,
      setQuickSelectContent,
      setDateRange: resetDateRange,
      boxClass,
      formatDateTextField,
      formatTimeTextField,
      recentlySelected,
      setRecentlySelected,
      setTermAnchorEl,
      quickSelectTerms,
      quickSelectIntervals,
      termAnchorEl,
      setIntervalAnchorEl,
      intervalAnchorEl,
      getDateRange: props.getDateRange,
      commonlyUsedText,
      timeFormat,
    };
  }

  function getDateSelectObj() {
    return {
      termAnchorEl,
      intervalAnchorEl,
      commonlyUsedText,
      setTermAnchorEl,
      setIntervalAnchorEl,
    };
  }

  function formatDateTextField(): void {
    setDateTextContents([
      DateRange.formatAbsoluteDate(dateRange.dates[0], dateFormatter),
      DateRange.formatAbsoluteDate(dateRange.dates[1], dateFormatter),
    ]);
  }

  function formatTimeTextField(datesProp?): void {
    const dates = datesProp || dateRange;
    setTimeTextContents([
      DateRange.formatAbsoluteTime(dates.dates[0], timeFormat),
      DateRange.formatAbsoluteTime(dates.dates[1], timeFormat),
    ]);
  }

  function resetDateRange(previous: DateRange): void {
    let newObject = new DateRange(localeObj);
    newObject.load(previous);
    setDateRange(newObject);
  }

  function applyChanges(): void {
    dateRange.applyChanges();
    resetDateRange(dateRange);
    console.log(dateRange);

    props.getDateRange(dateRange.dates);

    if (timerRunning) {
      setTimerRunning(false);
    }
  }

  function refreshTime(): void {
    dateRange.refreshDates();
    resetDateRange(dateRange);

    props.getDateRange(dateRange.dates);
    setTimerRunning(false);
    setTimerRunning(true);
  }

  function getApplyText(): JSX.Element {
    if (timerRunning) {
      return (
        <Box className={classes.flexRow}>
          <RefreshIcon />
          <Box ml={1} />
          Refresh
        </Box>
      );
    } else {
      return (
        <Box className={classes.flexRow}>
          <KeyboardTabIcon />
          <Box ml={1} />
          Update
        </Box>
      );
    }
  }

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.layout}>
        <Tabs onSelect={(index) => toggleDropdown(index)}>
          <TabList
            style={{
              width: "800px",
              height: "30px",
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
              listStyle: "none",
            }}
          >
            <Tab>
              <Button
                color="primary"
                variant="contained"
                className={classes.headerIconButton}
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
                  className={classes.headerIconButton}
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
                className={classes.headerApplyButton}
              >
                {getApplyText()}
              </Button>
            </Box>
            <Tab>
              <Box ml={2}>
                <Button color="primary" variant="text">
                  {dateRange.finalDisplayText[0]}
                </Button>
              </Box>
            </Tab>
            <span>&#10230;</span>
            <Tab>
              <Button color="primary" variant="text">
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
};
