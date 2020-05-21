import React, { useState, useContext } from "react";
import { Box } from "@material-ui/core";
import { DateRange } from "./../objects/DateRange";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Body } from "./Body";
import { MenuView } from "./Menu";
import { QuickSelect } from "./QuickSelect";
import "./../objects/Styling.css";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { GlobalContext } from "./../objects/Constants";
import { OptionalLocale, getWeekDays } from "./../objects/Locale";
import { style as themeStyle } from "./../objects/Style";
import { TimerTab } from "./header/TimerTab";
import { BodyTab } from "./header/BodyTab";
import { QuickSelectTab } from "./header/QuickSelectTab";
import { ApplyButton } from "./header/ApplyButton";
import {
  DateRangeUI,
  uiData,
  dropdownData as dData,
  DropdownData,
  refreshData as rData,
  RefreshData,
  bodyConfig as bConfig,
  BodyConfig,
} from "./../objects/Types";

interface Inputs {
  onTimerEvent(): void;
  onDateEvent(dates: Date[]): void;
  theme?: any;
  commonlyUsedText?: number[];
  quickSelectIntervals?: number[];
  relativeIntervals?: number[];
  minimumYearValue?: number;
  maximumYearValue?: number;
  setStoredRange?(dateRange: string[]): void;
  storedRange: string[] | null;
  localeObj: OptionalLocale;
}

export const Layout: React.FC<Inputs> = (props) => {
  // GLOBAL
  let defaults = useContext(GlobalContext);
  let noLocale: any = [];
  for (let obj of [defaults, props]) {
    let { localeObj, ...rest } = obj;
    noLocale.push(rest);
  }
  let localeObj = { ...defaults.localeObj, ...props.localeObj };
  localeObj.weekDays = getWeekDays(localeObj.localeString);
  defaults = {
    ...noLocale[0],
    ...noLocale[1],
    classes: themeStyle(),
    localeObj: localeObj,
  };

  // STATE OBJECTS
  const [dateRange, setDateRange] = useState<DateRange>(
    new DateRange(defaults.localeObj, uiData, props.storedRange)
  );
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
  const listStyle = {
    width: "800px",
    height: "30px",
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
    listStyle: "none",
  };
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

  const timerObj = {
    timerRunning,
    dateRange,
    onTimerEvent: props.onTimerEvent,
    setTimerRunning,
    resetDateRange,
    onDateEvent: props.onDateEvent,
    refreshData,
  };

  // REFRESH FUNCTIONS
  function resetDateRange(previous: DateRange): void {
    setDateRangeUI(previous.dateRangeUI);
    previous.setUI();
    let newObject = new DateRange(previous.localeObj, previous.dateRangeUI);
    newObject.load(previous);
    setDateRange(newObject);
  }

  function applyChanges(dr: DateRange): void {
    dr.applyChanges(props.setStoredRange);
    resetDateRange(dr);
    props.onDateEvent(dr.dates);

    if (timerRunning) {
      setTimerRunning(false);
    }
    setBoxClass("box-closed");
  }

  return (
    <MuiThemeProvider theme={defaults.theme}>
      <GlobalContext.Provider value={defaults}>
        <div className={defaults.classes.layout}>
          <Tabs onSelect={(index: number) => toggleDropdown(index)}>
            <TabList style={listStyle}>
              <Tab>
                <QuickSelectTab />
              </Tab>
              <Tab>
                <TimerTab {...timerObj} />
              </Tab>
              <Box ml={1}>
                <ApplyButton
                  dateRange={dateRange}
                  applyChanges={applyChanges}
                  timerRunning={timerRunning}
                />
              </Box>
              <Tab>
                <BodyTab dateRange={dateRange} index={0} />
              </Tab>
              <span>&#10230;</span>
              <Tab>
                <BodyTab dateRange={dateRange} index={1} />
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
      </GlobalContext.Provider>
    </MuiThemeProvider>
  );
};
