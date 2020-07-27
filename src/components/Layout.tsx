import React, { useState, useContext } from "react";
import { Box } from "@material-ui/core";
import { DateRange } from "../objects/DateRange";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Body } from "./Body";
import { MenuView } from "./Menu";
import { QuickSelect } from "./QuickSelect";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { GlobalContext } from "../objects/Constants";
import { OptionalLocale, getWeekDays } from "../objects/Locale";
import { style as themeStyle } from "../objects/Style";
import { TimerTab } from "./header/TimerTab";
import { BodyTab } from "./header/BodyTab";
import { QuickSelectTab } from "./header/QuickSelectTab";
import { ApplyButton } from "./header/ApplyButton";
import {
  DateRangeUI,
  uiData,
  dropdownData as dropdownDataInit,
  DropdownData,
  refreshData as refreshDataInit,
  RefreshData,
  bodyConfig as bodyConfigInit,
  BodyConfig
} from "./../objects/Types";

interface Inputs {
  onTimerEvent?(): void;
  onDateEvent(dates: Date[]): void;
  theme?: any;
  commonlyUsedText?: number[];
  quickSelectIntervals?: number[];
  relativeIntervals?: number[];
  minimumYearValue?: number;
  maximumYearValue?: number;
  setStoredRange?(dateRange: string[]): void;
  storedRange?: string[] | null;
  localeObj?: OptionalLocale;
}

export const Layout: React.FC<Inputs> = props => {
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
    classes: props.theme || themeStyle(),
    localeObj: localeObj
  };

  // STATE OBJECTS
  const [dateRange, setDateRange] = useState<DateRange>(
    new DateRange(defaults.localeObj, uiData, props.storedRange)
  );
  const [refreshData, setRefreshData] = useState<RefreshData>(refreshDataInit);
  const [dropdownData, setDropdownData] = useState<DropdownData>(
    dropdownDataInit
  );
  const [bodyConfig, setBodyConfig] = useState<BodyConfig>(bodyConfigInit);

  dateRange.setUI();

  const [dateRangeUI, setDateRangeUI] = useState<DateRangeUI>(
    dateRange.dateRangeUI
  );

  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // STYLING
  const listStyle = {
    width: "800px",
    height: "30px",
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
    listStyle: "none"
  };
  const [menuClass, setMenuClass] = useState<string>("menuClosed");
  const [boxClass, setBoxClass] = useState<string>("boxClosed");
  const toggleDropdown = (num: number): void => {
    if (num != 1 && bodyConfig.tabSelected != num) {
      if (boxClass == "boxClosed" || boxClass == "boxTiny") {
        setBoxClass("box");
        setMenuClass("menuClosed");
      }
      setBodyConfig({ ...bodyConfig, tabSelected: num });
    } else if (bodyConfig.tabSelected == num) {
      if (boxClass == "boxClosed") {
        setBoxClass("box");
        setMenuClass("menuClosed");
      } else {
        setBoxClass("boxClosed");
      }
    }
    if (num == 1) {
      if (menuClass == "menuClosed") {
        setMenuClass("menu");
        setBoxClass("boxClosed");
        setBodyConfig({ ...bodyConfig, tabSelected: num });
      } else {
        setMenuClass("menuClosed");
      }
    }
  };

  // COMPONENT OBJECTS
  const menuObj = {
    refreshData,
    setRefreshData,
    menuClass,
    timerRunning,
    setTimerRunning
  };

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
      setDateRange: resetDateRange
    };
  }

  const quickSelectObj = {
    dateRange,
    applyChanges,
    dateRangeUI,
    boxClass,
    setDropdownData,
    dropdownData,
    setDateRangeUI
  };

  const timerObj = {
    timerRunning,
    dateRange,
    onTimerEvent: props.onTimerEvent,
    setTimerRunning,
    resetDateRange,
    onDateEvent: props.onDateEvent,
    refreshData
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
    setBoxClass("boxClosed");
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
              <Box ml={1} mr={2}>
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
              <QuickSelect {...quickSelectObj} />
            </TabPanel>
            <TabPanel>
              <MenuView {...menuObj} />
            </TabPanel>
            <TabPanel>
              <Body {...getBodyObj(0)} />
            </TabPanel>
            <TabPanel>
              <Body {...getBodyObj(1)} />
            </TabPanel>
          </Tabs>
        </div>
      </GlobalContext.Provider>
    </MuiThemeProvider>
  );
};
