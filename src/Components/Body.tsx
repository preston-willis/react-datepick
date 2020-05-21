import React, { useEffect, useContext } from "react";
import { Button, Box } from "@material-ui/core";
import { NowSelect } from "./body/NowSelect";
import { AbsoluteView } from "./body/AbsoluteView";
import ReactList from "react-list";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { DateSelect } from "./body/RelativeDateSelect";
import "./../objects/Styling.css";
import { DateRange } from "./../objects/DateRange";
import { DateRangeUI, DropdownData, BodyConfig } from "./../objects/Types";
import { GlobalContext } from "./../objects/Constants";

interface Inputs {
  setBoxClass(boxClass: string): void;
  setDateRange(dateRange: DateRange): void;
  applyMasterChanges(dr: DateRange): void;
  setDateRangeUI(dateRangeUI: DateRangeUI): void;
  setDropdownData(data: DropdownData): void;
  setBodyConfig(config: BodyConfig): void;
  dateRangeUI: DateRangeUI;
  dateRange: DateRange;
  boxClass: string;
  index: number;
  dropdownData: DropdownData;
  bodyConfig: BodyConfig;
}

enum property {
  day = "day",
  month = "month",
  year = "year",
}

export const Body: React.FC<Inputs> = (props) => {
  const globals = useContext(GlobalContext);
  console.log("BODY " + JSON.stringify(globals, null, 4));

  const absoluteViewObj = {
    setBoxClass: props.setBoxClass,
    setDateRange: props.setDateRange,
    setDateRangeUI: props.setDateRangeUI,
    setBodyConfig: props.setBodyConfig,
    dateRangeUI: props.dateRangeUI,
    dateRange: props.dateRange,
    boxClass: props.boxClass,
    index: props.index,
    bodyConfig: props.bodyConfig,
    property,
    handleClick,
    resetDate,
  };

  const nowSelectObj = {
    applyMasterChanges: props.applyMasterChanges,
    dateRange: props.dateRange,
    index: props.index,
  };

  function applyFn(text: number): void {
    let dateRange = props.dateRange;
    dateRange.setRelative(text, props.index);
    props.setDateRange(dateRange);
  }

  function renderItem(index: number, key: number): JSX.Element {
    let dateKey = property.year;
    let name = "";
    let offset = 0;
    if (props.bodyConfig.propertySelected == 0) {
      dateKey = property.month;
      name = new Date(0, index + 1, 0).toLocaleString(
        globals.localeObj.localeString,
        {
          month: "long",
        }
      );
    } else {
      name = String(index + globals.minimumYearValue);
      offset = globals.maximumYearValue;
    }
    return (
      <Button
        key={key}
        onClick={() => handleClick(dateKey, index + offset)}
        variant="text"
        color="primary"
        size="large"
        className={globals.classes.bodyList}
      >
        {name}
      </Button>
    );
  }

  function resetDate(key: string, value: any): void {
    let dateRange = props.dateRange;
    let date = dateRange.dates[props.index];

    if (key == property.day) {
      date = new Date(date.getFullYear(), date.getMonth(), value);
    } else if (key == property.month) {
      date = new Date(date.getFullYear(), value, date.getDate());
    } else if (key == property.year) {
      date = new Date(value, date.getMonth(), date.getDate());
    }

    dateRange.setDate(date, props.index);

    props.setDateRange(dateRange);
    let daysInMonthContent = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    props.setBodyConfig({
      ...props.bodyConfig,
      daysInMonth: props.bodyConfig.daysInMonth.map((value, index) => {
        if (index == props.index) {
          return daysInMonthContent;
        } else {
          return value;
        }
      }),
    });
  }

  function handleClick(key: string, value: string | number): void {
    resetDate(key, value);
  }

  function renderScroll(): JSX.Element {
    if (props.boxClass == "box-wide") {
      if (props.bodyConfig.propertySelected == 1) {
        return (
          <Box mt={10}>
            <div className={globals.classes.bodyListContainer}>
              {" "}
              <ReactList
                itemRenderer={(index: any, key: any) => renderItem(index, key)}
                length={globals.maximumYearValue - globals.minimumYearValue}
                type="uniform"
              />
            </div>
          </Box>
        );
      } else {
        return (
          <Box mt={10}>
            <div className={globals.classes.bodyListContainer}>
              {" "}
              <ReactList
                itemRenderer={(index: any, key: any) => renderItem(index, key)}
                length={12}
                type="uniform"
              />
            </div>
          </Box>
        );
      }
    } else {
      return <div />;
    }
  }

  function renderTabButton(title: string): JSX.Element {
    return (
      <Button
        color="primary"
        variant="text"
        className={globals.classes.bodyTabButton}
      >
        {title}
      </Button>
    );
  }

  function renderTab(index: number): void {
    if (index !== 0) {
      props.setBoxClass("box-tiny");
    } else {
      props.setBoxClass("box");
    }
    props.setBodyConfig({ ...props.bodyConfig, bodySubTabIndex: index });
  }

  useEffect(() => {
    props.setBodyConfig({ ...props.bodyConfig, bodySubTabIndex: 0 });
    props.setBoxClass("box");
  }, [props.index]);

  useEffect(() => {
    if (props.boxClass == "box-closed") {
      props.setBodyConfig({ ...props.bodyConfig, bodySubTabIndex: 0 });
    }
  }, [props.boxClass]);

  function getDateSelectObj() {
    return {
      setDropdownData: props.setDropdownData,
      dropdownData: props.dropdownData,
      applyFn,
      dateRange: props.dateRange,
      classes: globals.classes,
    };
  }

  return (
    <Box className={props.boxClass}>
      <Tabs
        onSelect={(index: number) => renderTab(index)}
        selectedIndex={props.bodyConfig.bodySubTabIndex}
      >
        <TabList
          style={{
            width: "400px",
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            listStyle: "none",
            height: "25px",
          }}
        >
          <Tab>
            <Box ml={1} className={globals.classes.bodyTabHeader}>
              {renderTabButton("Absolute")}
            </Box>
          </Tab>
          <Tab>
            <Box ml={1} className={globals.classes.bodyTabHeader}>
              {renderTabButton("Relative")}
            </Box>
          </Tab>
          <Tab>
            <Box ml={1} className={globals.classes.bodyTabHeader}>
              {renderTabButton("Now")}
            </Box>
          </Tab>
        </TabList>
        <TabPanel>
          <AbsoluteView {...absoluteViewObj} />
        </TabPanel>
        <TabPanel>
          <Box mt={7} className={globals.classes.bodyDateSelectDropdown}>
            <DateSelect {...getDateSelectObj()} />
          </Box>
        </TabPanel>
        <TabPanel>
          <NowSelect {...nowSelectObj} />
        </TabPanel>
      </Tabs>
      {renderScroll()}
    </Box>
  );
};
