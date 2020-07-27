import React, { useState, useContext } from "react";
import { Box } from "@material-ui/core";
import { DateRange } from "../objects/DateRange";
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
import Popper from "@material-ui/core/Popper";
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
  const [boxClass, setBoxClass] = useState<string>("box");
  const [popperAnchorEL, setPopperAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const toggleDropdown = (num: number, event: any): void => {
    if (bodyConfig.tabSelected == num) {
      setBodyConfig({ ...bodyConfig, tabSelected: -1 });
      setPopperAnchorEl(null);
    } else {
      setBodyConfig({ ...bodyConfig, tabSelected: num });
      setPopperAnchorEl(event.currentTarget);
    }
  };

  // COMPONENT OBJECTS
  const menuObj = {
    refreshData,
    setRefreshData,
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
    setBodyConfig({ ...bodyConfig, tabSelected: -1 });
  }

  return (
    <MuiThemeProvider theme={defaults.theme}>
      <GlobalContext.Provider value={defaults}>
        <div className={defaults.classes.layout}>
          <Box className={defaults.classes.flexRow}>
            <QuickSelectTab handleClick={toggleDropdown} />
            <TimerTab handleClick={toggleDropdown} {...timerObj} />
            <Box ml={1} mr={2}>
              <ApplyButton
                dateRange={dateRange}
                applyChanges={applyChanges}
                timerRunning={timerRunning}
              />
            </Box>

            <BodyTab
              handleClick={toggleDropdown}
              dateRange={dateRange}
              index={0}
            />
            <Box mt={1}>
              <span>&#10230;</span>
            </Box>
            <BodyTab
              handleClick={toggleDropdown}
              dateRange={dateRange}
              index={1}
            />
          </Box>
          <Popper open={bodyConfig.tabSelected == 0} anchorEl={popperAnchorEL}>
            <Box ml={-4}>
              <QuickSelect {...quickSelectObj} />
            </Box>
          </Popper>
          <Popper open={bodyConfig.tabSelected == 1} anchorEl={popperAnchorEL}>
            <Box ml={-4}>
              <MenuView {...menuObj} />
            </Box>
          </Popper>
          <Popper open={bodyConfig.tabSelected == 2} anchorEl={popperAnchorEL}>
            <Box ml={-4}>
              <Body {...getBodyObj(0)} />
            </Box>
          </Popper>
          <Popper open={bodyConfig.tabSelected == 3} anchorEl={popperAnchorEL}>
            <Box ml={-4}>
              <Body {...getBodyObj(1)} />
            </Box>
          </Popper>
        </div>
        ,
      </GlobalContext.Provider>
    </MuiThemeProvider>
  );
};
