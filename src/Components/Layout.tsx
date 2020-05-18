import React, { useState, useContext } from "react";
import { Button, Box } from "@material-ui/core";
import { DateRange } from "./DateRange";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Body } from "./Body";
import { MenuView } from "./Menu";
import { TimerUI } from "./Timer";
import { QuickSelect } from "./QuickSelect";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import KeyboardTabIcon from "@material-ui/icons/KeyboardTab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RefreshIcon from "@material-ui/icons/Refresh";
import "./Styling.css";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { GlobalContext } from "./Constants";
import {
  DateRangeUI,
  uiData,
  dropdownData as dData,
  DropdownData,
  refreshData as rData,
  RefreshData,
  bodyConfig as bConfig,
  BodyConfig,
} from "./Types";
import { style as themeStyle } from "./Style";

interface Inputs {
  onTimerEvent(): void;
  onDateEvent(dates: Date[]): void;
  dateFormatter?: Intl.DateTimeFormat;
  theme?: any;
  commonlyUsedText?: number[];
  quickSelectTerms?: string[];
  quickSelectIntervals?: number[];
  relativeTerms?: string[];
  relativeIntervals?: number[];
  localeString?: string;
  nowText?: string;
  minimumYearValue?: number;
  maximumYearValue?: number;
  humanizer?: any;
  setStoredRange?(dateRange: string[]): void;
  storedRange: string[] | null;
}

export const Layout: React.FC<Inputs> = (props) => {
  // GLOBAL
  let defaults = useContext(GlobalContext);
  defaults.classes = themeStyle();
  defaults.commonlyUsedText =
    props.commonlyUsedText || defaults.commonlyUsedText;

  defaults.quickSelectIntervals =
    props.quickSelectIntervals || defaults.quickSelectIntervals;

  defaults.relativeIntervals =
    props.relativeIntervals || defaults.quickSelectIntervals;

  defaults.minimumYearValue =
    props.minimumYearValue || defaults.minimumYearValue;

  defaults.maximumYearValue =
    props.maximumYearValue || defaults.maximumYearValue;

  defaults.localeObj = {
    localeString: props.localeString || defaults.localeObj.localeString,
    dateFormatter: props.dateFormatter || defaults.localeObj.dateFormatter,
    quickSelectTerms:
      props.quickSelectTerms || defaults.localeObj.quickSelectTerms,
    relativeTerms: props.relativeTerms || defaults.localeObj.relativeTerms,
    nowText: props.nowText || defaults.localeObj.nowText,
    humanizer: props.humanizer || defaults.localeObj.humanizer,
  };

  // STORAGE
  const setStoredRange:
    | ((dateRange: DateRange) => void)
    | (() => null) = props.setStoredRange
    ? (dateRange) => {
        let dates: string[] = [
          String(dateRange.finalDates[0].getTime()),
          String(dateRange.finalDates[1].getTime()),
        ];
        for (let i = 0; i < dates.length; i++) {
          if (dateRange.isAbsolute(i)) {
            dates[i] = dates[i] + "A";
          } else {
            dates[i] = dateRange.relativeMS[i] + "R";
          }
        }
        return props.setStoredRange!(dates);
      }
    : () => {
        return null;
      };

  let storedRange = new DateRange(defaults.localeObj, uiData);
  {
    let data = props.storedRange;
    if (data) {
      let identifier = [data[0].slice(-1), data[1].slice(-1)];
      data = [data[0].slice(0, -1), data[1].slice(0, -1)];
      for (let p = 0; p < data.length; p++) {
        if (identifier[p] === "A") {
          let out = new Date(parseInt(data[p]));
          storedRange.setDate(out, p);
        } else {
          storedRange.setRelative(parseInt(data[p]), p);
        }
      }
      storedRange.applyChanges();
    }
  }

  // STATE OBJECTS
  const [dateRange, setDateRange] = useState<DateRange>(storedRange);
  const [refreshData, setRefreshData] = useState<RefreshData>(rData);
  const [dropdownData, setDropdownData] = useState<DropdownData>(dData);
  const [bodyConfig, setBodyConfig] = useState<BodyConfig>(bConfig);

  dateRange.setUI();

  const [dateRangeUI, setDateRangeUI] = useState<DateRangeUI>(
    dateRange.dateRangeUI
  );

  // QUICK SELECT
  const [recentlySelected, setRecentlySelected] = useState<number[]>([]);

  // MENU
  const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [menuError, setMenuError] = useState<boolean>(false);

  // STYLING
  const [menuClass, setMenuClass] = useState<string>("menu-closed");
  const [boxClass, setBoxClass] = useState<string>("box-closed");
  const toggleDropdown = (num: number): void => {
    if (num != 1 && bodyConfig.tabSelected != num) {
      if (boxClass == "box-closed" || boxClass == "box-tiny") {
        setBoxClass("box");
        setMenuClass("menu-closed");
      }
      setBodyConfig({ ...bodyConfig, tabSelected: num });
    } else if (bodyConfig.tabSelected == num) {
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
        setBodyConfig({ ...bodyConfig, tabSelected: num });
      } else {
        setMenuClass("menu-closed");
      }
    }
  };

  // COMPONENT OBJECTS
  function getMenuObj() {
    return {
      menuError,
      setMenuError,
      timerRunning,
      setTimerRunning,
      refreshData,
      setRefreshData,
      anchorEl,
      setAnchorEl,
      menuClass,
    };
  }

  function getBodyObj(index: number) {
    return {
      applyMasterChanges: applyChanges,
      boxClass,
      setBoxClass,
      index,
      bodyConfig,
      setBodyConfig,
      dateRangeUI,
      dateRange,
      dropdownData,
      setDropdownData,
      setDateRangeUI,
      setDateRange: resetDateRange,
    };
  }

  function getQuickSelectObj() {
    return {
      dateRange,
      applyChanges,
      dateRangeUI,
      boxClass,
      setDropdownData,
      dropdownData,
      recentlySelected,
      setRecentlySelected,
      setDateRangeUI,
    };
  }

  // REFRESH FUNCTIONS
  function resetDateRange(previous: DateRange): void {
    setDateRangeUI(previous.dateRangeUI);
    previous.setUI();
    let newObject = new DateRange(previous.localeObj, previous.dateRangeUI);
    newObject.load(previous);
    setDateRange(newObject);
  }

  function applyChanges(dr: DateRange): void {
    dr.applyChanges();
    resetDateRange(dr);
    props.onDateEvent(dr.dates);
    setStoredRange(dr);

    if (timerRunning) {
      setTimerRunning(false);
    }
    setBoxClass("box-closed");
  }

  function refreshTime(): void {
    dateRange.refreshDates();
    resetDateRange(dateRange);

    props.onDateEvent(dateRange.dates);
    setTimerRunning(false);
    setTimerRunning(true);
  }

  // RENDERING
  function getApplyText(): JSX.Element {
    if (timerRunning) {
      return (
        <Box className={defaults.classes.flexRow}>
          <RefreshIcon />
          <Box ml={1} />
          Refresh
        </Box>
      );
    } else {
      return (
        <Box className={defaults.classes.flexRow}>
          <KeyboardTabIcon />
          <Box ml={1} />
          Update
        </Box>
      );
    }
  }

  return (
    <MuiThemeProvider theme={defaults.theme}>
      <div className={defaults.classes.layout}>
        <Tabs onSelect={(index: number) => toggleDropdown(index)}>
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
                className={defaults.classes.headerIconButton}
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
                  className={defaults.classes.headerIconButton}
                >
                  <TimerUI
                    timerRunning={timerRunning}
                    refreshInterval={refreshData.refreshInterval}
                    refreshIntervalUnits={refreshData.refreshIntervalUnits}
                    resetFn={props.onTimerEvent}
                    applyFn={refreshTime}
                  />
                </Button>
              </Box>
            </Tab>
            <Box ml={1}>
              <Button
                onClick={() => applyChanges(dateRange)}
                variant="contained"
                color="primary"
                className={defaults.classes.headerApplyButton}
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
            <Body {...getBodyObj(0)} />
          </TabPanel>
          <TabPanel>
            <Body {...getBodyObj(1)} />
          </TabPanel>
        </Tabs>
      </div>
      ,
    </MuiThemeProvider>
  );
};
