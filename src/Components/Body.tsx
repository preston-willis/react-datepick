import React, { useEffect, useContext } from "react";
import {
  Button,
  Box,
  Typography,
  TextField,
  Grid,
  IconButton,
} from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ReactList from "react-list";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { DateSelect } from "./RelativeDateSelect";
import "./Styling.css";
import { DateRange } from "./DateRange";
import { DateRangeUI, DropdownData, BodyConfig } from "./Types";
import { GlobalContext } from "./Constants";

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

  const shortWeekdayDateMap = {
    Mon: new Date("2020-01-06"),
    Tue: new Date("2020-01-07"),
    Wed: new Date("2020-01-08"),
    Thu: new Date("2020-01-09"),
    Fri: new Date("2020-01-10"),
    Sat: new Date("2020-01-11"),
    Sun: new Date("2020-01-12"),
  };

  const shortWeekdays = Object.keys(shortWeekdayDateMap);

  const getDayOfWeek = (
    shortName: string,
    locale = globals.localeObj.localeString,
    length = "short"
  ) =>
    new Intl.DateTimeFormat(locale, { weekday: length }).format(
      shortWeekdayDateMap[shortName]
    );

  const getDaysOfWeek = (
    locale = globals.localeObj.localeString,
    length = "short"
  ) =>
    shortWeekdays.map((shortName) => getDayOfWeek(shortName, locale, length));

  const day = getDaysOfWeek(globals.localeObj.localeString);

  const getVariant = (item: number) => {
    if (item == props.dateRange.dates[props.index].getDate()) {
      return "contained";
    } else {
      return "outlined";
    }
  };

  function toggleBox(): void {
    if (props.boxClass == "box") {
      props.setBoxClass("box-wide");
    } else {
      props.setBoxClass("box");
    }
  }

  function updateTransition(index: number): void {
    if (props.bodyConfig.propertySelected == -1) {
      props.setBodyConfig({ ...props.bodyConfig, propertySelected: index });
      props.setBoxClass("box-wide");
    } else if (index == props.bodyConfig.propertySelected) {
      toggleBox();
    } else if (
      index != props.bodyConfig.propertySelected &&
      props.boxClass == "box-wide"
    ) {
      props.setBodyConfig({ ...props.bodyConfig, propertySelected: index });
    } else if (
      index != props.bodyConfig.propertySelected &&
      props.boxClass == "box"
    ) {
      props.setBodyConfig({ ...props.bodyConfig, propertySelected: index });
      toggleBox();
    }
  }

  function handleTextChange(event: string): void {
    let error = false;

    try {
      let newDate = new Date(event);
      const dtf = globals.localeObj.dateFormatter;

      const [
        { value: textMonth },
        ,
        { value: textDay },
        ,
        { value: textYear },
      ] = dtf.formatToParts(newDate);
      console.log(textMonth);
      console.log(textYear);
      console.log(textDay);

      if (
        parseInt(textDay) >= 0 &&
        parseInt(textMonth) >= 0 &&
        parseInt(textMonth) < 12 &&
        parseInt(textYear) > globals.minimumYearValue &&
        parseInt(textYear) < globals.maximumYearValue
      ) {
        resetDate(property.day, textDay);
        resetDate(property.month, String(parseInt(textMonth) - 1));
        resetDate(property.year, textYear);
      } else {
        error = true;
      }
    } catch (err) {
      error = true;
    }

    props.setDateRangeUI({
      ...props.dateRangeUI,
      dateTextContent: props.dateRangeUI.dateTextContent.map((value, index) => {
        if (index == props.index) {
          return event;
        } else {
          return value;
        }
      }),
      dateError: props.dateRangeUI.dateError.map((value, index) => {
        if (index == props.index) {
          return error;
        } else {
          return value;
        }
      }),
    });
  }

  function handleTimeChange(event: string): void {
    let error = false;
    let dateRange = props.dateRange;

    try {
      let date = new Date(
        props.dateRange.dates[props.index].toDateString() + " " + event
      );
      if (!isNaN(date.getTime())) {
        dateRange.setDate(date, props.index);
        props.setDateRange(dateRange);
      } else {
        error = true;
      }
    } catch (err) {
      error = true;
    }

    props.setDateRangeUI({
      ...props.dateRangeUI,
      timeTextContent: props.dateRangeUI.timeTextContent.map((value, index) => {
        if (index == props.index) {
          return event;
        } else {
          return value;
        }
      }),
      timeError: props.dateRangeUI.timeError.map((value, index) => {
        if (index == props.index) {
          return error;
        } else {
          return value;
        }
      }),
    });
  }

  function handleClick(key: string, value: string | number): void {
    resetDate(key, value);
  }

  function applyFn(text: number): void {
    let dateRange = props.dateRange;
    dateRange.setRelative(text, props.index);
    props.setDateRange(dateRange);
  }

  function setNow(): void {
    let dateRange = props.dateRange;
    dateRange.setNow(props.index);
    props.applyMasterChanges(dateRange);
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

  function getTextTitle(): string {
    if (props.index == 1) {
      return "End Date";
    } else {
      return "Start Date";
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
          <Box className={globals.classes.bodyAbsoluteTab}>
            <Box className={globals.classes.bodyHeader} mt={2} mb={2}>
              <Box mt={2}>
                <IconButton
                  onClick={() => updateTransition(0)}
                  className={globals.classes.calendarButton}
                  size="small"
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>
              <Box mt={2} mr={1}>
                <Typography color="textPrimary" variant="h5">
                  {props.dateRange.dates[props.index].toLocaleString(
                    globals.localeObj.localeString,
                    {
                      month: "long",
                    }
                  )}
                </Typography>
              </Box>
              <Box mt={2}>
                <Typography color="secondary" variant="h5">
                  {props.dateRange.dates[props.index].getFullYear()}
                </Typography>
              </Box>
              <Box ml={1} mt={2}>
                <IconButton
                  onClick={() => updateTransition(1)}
                  className={globals.classes.calendarButton}
                  size="small"
                  color="secondary"
                >
                  <ArrowBackIosIcon />
                </IconButton>
              </Box>
            </Box>
            <Box ml={4}>
              <Grid
                container
                justify="flex-start"
                spacing={1}
                className={globals.classes.calendar}
              >
                {[...Array(7).keys()].map((item) => (
                  <Grid key={item} item>
                    <Button
                      disableRipple={true}
                      color="secondary"
                      size="small"
                      variant="text"
                      className={globals.classes.calendarButton}
                    >
                      {day[item]}
                    </Button>
                  </Grid>
                ))}

                {[
                  ...Array(
                    new Date(
                      props.dateRange.dates[props.index].getFullYear(),
                      props.dateRange.dates[props.index].getMonth(),
                      1
                    ).getDay()
                  ).keys(),
                ].map((item) => (
                  <Grid key={item} item>
                    <Button
                      className={globals.classes.calendarButton}
                      size="small"
                      color="primary"
                      variant="contained"
                      disableRipple
                    >
                      {""}
                    </Button>
                  </Grid>
                ))}
                {[
                  ...Array(props.bodyConfig.daysInMonth[props.index]).keys(),
                ].map((item) => (
                  <Grid key={item} item>
                    <Button
                      onClick={() => handleClick("day", item + 1)}
                      className={globals.classes.calendarButton}
                      size="small"
                      color="primary"
                      variant={getVariant(item + 1)}
                      disableRipple
                    >
                      {item + 1}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box mt={11} className={globals.classes.flexRow}>
              <TextField
                error={props.dateRangeUI.dateError[props.index]}
                fullWidth={false}
                className={globals.classes.bodyTextField}
                value={props.dateRangeUI.dateTextContent[props.index]}
                size="small"
                id="outlined-basic"
                label={getTextTitle()}
                variant="outlined"
                onChange={(event) => handleTextChange(event.target.value)}
              />
              <TextField
                error={props.dateRangeUI.timeError[props.index]}
                fullWidth={false}
                className={globals.classes.bodyTextField}
                value={props.dateRangeUI.timeTextContent[props.index]}
                size="small"
                id="outlined-basic"
                label="Time"
                variant="outlined"
                onChange={(event) => handleTimeChange(event.target.value)}
              />
            </Box>
          </Box>
        </TabPanel>
        <TabPanel>
          <Box mt={7} className={globals.classes.bodyDateSelectDropdown}>
            <DateSelect {...getDateSelectObj()} />
          </Box>
        </TabPanel>
        <TabPanel>
          <Box className={globals.classes.bodyDateSelectDropdown}>
            <Box mt={3} className={globals.classes.bodySetNow}>
              <Typography>
                Setting time to now means that on every refresh, the current
                time will be reset.
              </Typography>
            </Box>
            <Box mt={3}>
              <Button
                onClick={() => setNow()}
                variant="contained"
                color="primary"
                className={globals.classes.bodySetNowButton}
              >
                Set time to now
              </Button>
            </Box>
          </Box>
        </TabPanel>
      </Tabs>
      {renderScroll()}
    </Box>
  );
};
