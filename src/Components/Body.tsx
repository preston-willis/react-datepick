import React, { Fragment, useEffect } from "react";
import { Divider } from "@material-ui/core";
import {
  Button,
  Box,
  Typography,
  GridList,
  GridListTile,
  TextField,
  Grid,
} from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ReactList from "react-list";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { DateSelect } from "./RelativeDateSelect.tsx";
import "./Styling.css";
import DateRange from "./DateRange.tsx";
import ms from "ms";
import {
  format,
  formatDistance,
  formatRelative,
  subDays,
  getMonth,
  getDay,
  getYear,
} from "date-fns";

interface Inputs {
  setBoxClass(boxClass: string): void;
  setPropertySelected(property: number): void;
  setDateError(error: boolean[]): void;
  setDaysInMonth(days: number[]): void;
  setTimeError(time: boolean[]): void;
  setTermAnchorEl(element: EventTarget | null): void;
  setIntervalAnchorEl(element: EventTarget | null): void;
  setBodySubTabIndex(index: number): void;
  setDateRange(dateRange: DateRange): void;
  setDateTextContents(content: string[]): void;
  setTimeTextContents(content: string[]): void;
  setRelativeSelectContent(content: string[]): void;
  formatTimeTextField(dates?: DateRange): void;
  formatDateTextField(dates?: DateRange): void;
  classes: any;
  minimumYearValue: number;
  maximumYearValue: number;
  relativeTerms: string[];
  relativeIntervals: string[];
  relativeSelectContent: string[];
  dateTextContents: string[];
  timeTextContents: string[];
  dateRange: DateRange;
  bodySubTabIndex: number;
  termAnchorEl: any;
  intervalAnchorEl: any;
  timeError: boolean[];
  boxClass: string;
  index: number;
  propertySelected: number;
  dateError: boolean[];
  daysInMonth: number[];
  timeFormat: string;
  dateFormatter: Intl.DateTimeFormat;
}

enum property {
  day = "day",
  month = "month",
  year = "year",
}

export const Body: React.FC<Inputs> = (props) => {
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
    shortName,
    locale = props.timeFormat,
    length = "short"
  ) =>
    new Intl.DateTimeFormat(locale, { weekday: length }).format(
      shortWeekdayDateMap[shortName]
    );

  const getDaysOfWeek = (locale = props.timeFormat, length = "short") =>
    shortWeekdays.map((shortName) => getDayOfWeek(shortName, locale, length));

  const day = getDaysOfWeek(props.timeFormat);

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
    if (props.propertySelected == -1) {
      props.setPropertySelected(index);
      props.setBoxClass("box-wide");
    } else if (index == props.propertySelected) {
      toggleBox();
    } else if (
      index != props.propertySelected &&
      props.boxClass == "box-wide"
    ) {
      props.setPropertySelected(index);
    } else if (index != props.propertySelected && props.boxClass == "box") {
      props.setPropertySelected(index);
      toggleBox();
    }
  }

  function stateFormatter(
    value: any,
    getProp: any,
    setProp: (f: any) => void
  ): void {
    let temp = getProp;
    temp[props.index] = value;
    setProp([temp[0], temp[1]]);
  }

  function handleTextChange(event: string): void {
    let error = false;

    stateFormatter(event, props.dateTextContents, props.setDateTextContents);
    try {
      let newDate = new Date(event);
      const dtf = props.dateFormatter;

      const [
        { value: textMonth },
        ,
        { value: textDay },
        ,
        { value: textYear },
      ] = dtf.formatToParts(newDate);

      if (
        parseInt(textDay) >= 0 &&
        parseInt(textMonth) >= 0 &&
        parseInt(textMonth) < 12 &&
        parseInt(textYear) < props.minimumYearValue &&
        parseInt(textYear) > props.maximumYearValue
      ) {
        resetDate(property.day, textDay);
        resetDate(property.month, String(parseInt(textMonth) - 1));
        resetDate(property.year, textYear);
      }
    } catch (err) {
      error = true;
    }
    stateFormatter(error, props.dateError, props.setDateError);
  }

  function handleTimeChange(event: string): void {
    let error = false;
    let dateRange = props.dateRange;
    stateFormatter(event, props.timeTextContents, props.setTimeTextContents);

    try {
      let date = new Date(
        props.dateRange.dates[props.index].toDateString() + " " + event
      );
      if (!isNaN(date.getTime())) {
        dateRange.setDate(
          date,
          props.index,
          props.dateFormatter,
          props.timeFormat
        );
        props.setDateRange(dateRange);
      } else {
        error = true;
      }
    } catch (err) {
      error = true;
    }

    stateFormatter(error, props.timeError, props.setTimeError);
  }

  function handleClick(key: string, value: string | number): void {
    resetDate(key, value);
    stateFormatter(
      DateRange.formatAbsoluteDate(
        props.dateRange.dates[props.index],
        props.dateFormatter
      ),
      props.dateTextContents,
      props.setDateTextContents
    );
    stateFormatter(
      props.dateRange.dates[props.index].toLocaleTimeString(props.timeFormat),
      props.timeTextContents,
      props.setTimeTextContents
    );
  }

  function applyFn(text: string[]): void {
    let dateRange = props.dateRange;
    dateRange.setRelative(text.join(" "), props.index);
    props.setDateRange(dateRange);
    props.formatDateTextField(dateRange);
    props.formatTimeTextField(dateRange);
  }

  function setNow(): void {
    let dateRange = props.dateRange;
    dateRange.setNow(props.index);
    props.setDateRange(dateRange);
    props.formatTimeTextField(dateRange);
    props.formatDateTextField(dateRange);
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

    dateRange.setDate(date, props.index, props.dateFormatter, props.timeFormat);
    props.setDateRange(dateRange);

    console.log("NEW DATE: " + dateRange.displayText[props.index]);

    let daysInMonthContent = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    stateFormatter(daysInMonthContent, props.daysInMonth, props.setDaysInMonth);
  }

  function renderItem(index: number): JSX.Element {
    let key = property.year;
    let name = "";
    if (props.propertySelected == 0) {
      key = property.month;
      name = new Date(0, index + 1, 0).toLocaleString(props.timeFormat, {
        month: "long",
      });
    } else {
      name = String(index + props.minimumYearValue);
    }
    return (
      <Button
        onClick={() => handleClick(key, index + props.minimumYearValue)}
        variant="text"
        color="primary"
        size="large"
        className={props.classes.bodyList}
      >
        {name}
      </Button>
    );
  }

  function renderScroll(): JSX.Element {
    if (props.boxClass == "box-wide") {
      if (props.propertySelected == 1) {
        return (
          <Box mt={10}>
            <div className={props.classes.bodyListContainer}>
              {" "}
              <ReactList
                itemRenderer={(index) => renderItem(index)}
                length={props.maximumYearValue - props.minimumYearValue}
                type="uniform"
              />
            </div>
          </Box>
        );
      } else {
        return (
          <Box mt={10}>
            <div className={props.classes.bodyListContainer}>
              {" "}
              <ReactList
                itemRenderer={(index) => renderItem(index)}
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
        className={props.classes.bodyTabButton}
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
    props.setBodySubTabIndex(index);
  }

  useEffect(() => {
    props.setBodySubTabIndex(0);
    props.setBoxClass("box");
  }, [props.index]);

  useEffect(() => {
    if (props.boxClass == "box-closed") {
      props.setBodySubTabIndex(0);
    }
  }, [props.boxClass]);

  function getDateSelectObj() {
    return {
      termAnchorEl: props.termAnchorEl,
      intervalAnchorEl: props.intervalAnchorEl,
      setTermAnchorEl: props.setTermAnchorEl,
      relativeSelectContent: props.relativeSelectContent,
      applyFn,
      classes: props.classes,
      setIntervalAnchorEl: props.setIntervalAnchorEl,
      relativeTerms: props.relativeIntervals,
      relativeIntervals: props.relativeTerms,
    };
  }

  return (
    <Box className={props.boxClass}>
      <Tabs
        onSelect={(index) => renderTab(index)}
        selectedIndex={props.bodySubTabIndex}
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
            <Box ml={1} className={props.classes.bodyTabHeader}>
              {renderTabButton("Absolute")}
            </Box>
          </Tab>
          <Tab>
            <Box ml={1} className={props.classes.bodyTabHeader}>
              {renderTabButton("Relative")}
            </Box>
          </Tab>
          <Tab>
            <Box ml={1} className={props.classes.bodyTabHeader}>
              {renderTabButton("Now")}
            </Box>
          </Tab>
        </TabList>
        <TabPanel>
          <Box className={props.classes.bodyAbsoluteTab}>
            <Box className={props.classes.bodyHeader} mt={2} mb={2}>
              <Box mt={2}>
                <Button
                  onClick={() => updateTransition(0)}
                  className={props.classes.calendarButton}
                  size="small"
                  variant="text"
                >
                  <ArrowForwardIosIcon />
                </Button>
              </Box>
              <Box mt={2} mr={1}>
                <Typography color="textPrimary" variant="h5">
                  {props.dateRange.dates[props.index].toLocaleString(
                    props.timeFormat,
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
                <Button
                  onClick={() => updateTransition(1)}
                  className={props.classes.calendarButton}
                  size="small"
                  color="secondary"
                  variant="text"
                >
                  <ArrowBackIosIcon />
                </Button>
              </Box>
            </Box>
            <Box ml={4}>
              <Grid
                container
                justify="flex-start"
                spacing={1}
                className={props.classes.calendar}
              >
                {[...Array(7).keys()].map((item) => (
                  <Grid item>
                    <Button
                      disableRipple={true}
                      color="secondary"
                      size="small"
                      variant="text"
                      className={props.classes.calendarButton}
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
                      className={props.classes.calendarButton}
                      size="small"
                      color="primary"
                      variant="contained"
                      disableRipple
                    ></Button>
                  </Grid>
                ))}
                {[...Array(props.daysInMonth[props.index]).keys()].map(
                  (item) => (
                    <Grid key={item} item>
                      <Button
                        onClick={() => handleClick("day", item + 1)}
                        className={props.classes.calendarButton}
                        size="small"
                        color="primary"
                        variant={getVariant(item + 1)}
                        disableRipple
                      >
                        {item + 1}
                      </Button>
                    </Grid>
                  )
                )}
              </Grid>
            </Box>
            <Box mt={11} className={props.classes.flexRow}>
              <TextField
                error={props.dateError[props.index]}
                fullWidth={false}
                className={props.classes.bodyTextField}
                value={props.dateTextContents[props.index]}
                size="small"
                id="outlined-basic"
                label={getTextTitle()}
                variant="outlined"
                onChange={(event) => handleTextChange(event.target.value)}
              />
              <TextField
                error={props.timeError[props.index]}
                fullWidth={false}
                className={props.classes.bodyTextField}
                value={props.timeTextContents[props.index]}
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
          <Box mt={7} className={props.classes.bodyDateSelectDropdown}>
            <DateSelect {...getDateSelectObj()} />
          </Box>
        </TabPanel>
        <TabPanel>
          <Box className={props.classes.bodyDateSelectDropdown}>
            <Box mt={3} className={props.classes.bodySetNow}>
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
                className={props.classes.bodySetNowButton}
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
