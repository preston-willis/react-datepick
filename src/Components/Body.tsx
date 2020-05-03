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
  setBoxClass(z): void;
  setPropertySelected(a): void;
  setDateError(f): void;
  setDaysInMonth(g): void;
  setTimeError(j): void;
  setTermAnchorEl(x): void;
  setIntervalAnchorEl(y): void;
  setBodySubTabIndex(m): void;
  setDateRange(h): void;
  setDateTextContents(k): void;
  setTimeTextContents(j): void;
  setRelativeSelectContent(f): void;
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
  const day = ["S", "M", "T", "W", "T", "F", "S"];

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
    var temp = getProp;
    temp[props.index] = value;
    setProp([temp[0], temp[1]]);
  }

  function handleTextChange(event: string): void {
    var error = false;

    stateFormatter(event, props.dateTextContents, props.setDateTextContents);
    try {
      var newDate = new Date(event);
      const dtf = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "numeric",
        day: "2-digit",
      });

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
        parseInt(textYear) < 3000 &&
        parseInt(textYear) > 0
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
    var error = false;
    var dateRange = props.dateRange;
    stateFormatter(event, props.timeTextContents, props.setTimeTextContents);

    try {
      var date = new Date(
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
    var dateRange = props.dateRange;
    dateRange.setRelative(text.join(" "), props.index);
    props.setDateRange(dateRange);
  }

  function setNow(): void {
    var dateRange = props.dateRange;
    dateRange.setNow(props.index);
    props.setDateRange(dateRange);
  }

  function resetDate(key: string, value: any): void {
    var dateRange = props.dateRange;
    var date = dateRange.dates[props.index];

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

    var daysInMonthContent = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    stateFormatter(daysInMonthContent, props.daysInMonth, props.setDaysInMonth);
  }

  function renderItem(index: number): JSX.Element {
    var key = property.year;
    var name = "";
    if (props.propertySelected == 0) {
      key = property.month;
      name = new Date(0, index + 1, 0).toLocaleString("default", {
        month: "long",
      });
    } else {
      name = String(index);
    }
    return (
      <Button
        onClick={() => handleClick(key, index)}
        variant="text"
        color="primary"
        size="large"
        style={{
          maxWidth: "100px",
          maxHeight: "30px",
          minWidth: "100px",
          minHeight: "30px",
        }}
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
            <div style={{ overflow: "auto", maxHeight: 350, maxWidth: 120 }}>
              {" "}
              <ReactList
                itemRenderer={(index) => renderItem(index)}
                length={2100}
                type="uniform"
              />
            </div>
          </Box>
        );
      } else {
        return (
          <Box mt={10}>
            <div style={{ overflow: "auto", maxHeight: 350, maxWidth: 120 }}>
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
        style={{
          minHeight: "35px",
          maxHeight: "35px",
          minWidth: "100px",
          maxWidth: "100px",
        }}
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
            <Box ml={1} style={{ height: "10px" }}>
              {renderTabButton("Absolute")}
            </Box>
          </Tab>
          <Tab>
            <Box ml={1} style={{ height: "10px" }}>
              {renderTabButton("Relative")}
            </Box>
          </Tab>
          <Tab>
            <Box ml={1} style={{ height: "10px" }}>
              {renderTabButton("Now")}
            </Box>
          </Tab>
        </TabList>
        <TabPanel>
          <Box
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              width: "400px",
            }}
          >
            <Box className="box-header" mt={2} mb={2}>
              <Box mt={2}>
                <Button
                  onClick={() => updateTransition(0)}
                  style={{
                    maxWidth: "30px",
                    maxHeight: "30px",
                    minWidth: "30px",
                    minHeight: "30px",
                  }}
                  size="small"
                  variant="text"
                >
                  <ArrowForwardIosIcon />
                </Button>
              </Box>
              <Box mt={2} mr={1}>
                <Typography color="textPrimary" variant="h5">
                  {props.dateRange.dates[props.index].toLocaleString(
                    "default",
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
                  style={{
                    maxWidth: "30px",
                    maxHeight: "30px",
                    minWidth: "30px",
                    minHeight: "30px",
                  }}
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
                style={{
                  maxWidth: "300px",
                  maxHeight: "200px",
                  minWidth: "300px",
                  minHeight: "200px",
                }}
              >
                {[...Array(7).keys()].map((item) => (
                  <Grid item>
                    <Button
                      disableRipple={true}
                      color="secondary"
                      size="small"
                      variant="text"
                      style={{
                        maxWidth: "30px",
                        maxHeight: "30px",
                        minWidth: "30px",
                        minHeight: "30px",
                      }}
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
                      style={{
                        maxWidth: "30px",
                        maxHeight: "30px",
                        minWidth: "30px",
                        minHeight: "30px",
                      }}
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
                        style={{
                          maxWidth: "30px",
                          maxHeight: "30px",
                          minWidth: "30px",
                          minHeight: "30px",
                        }}
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
            <Box mt={11} style={{ display: "flex", flexDirection: "row" }}>
              <TextField
                error={props.dateError[props.index]}
                fullWidth={false}
                style={{ width: 125 }}
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
                style={{ width: 125 }}
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
          <Box
            mt={7}
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              width: "400px",
              height: "225px",
            }}
          >
            <DateSelect {...getDateSelectObj()} />
          </Box>
        </TabPanel>
        <TabPanel>
          <Box
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              width: "400px",
              height: "225px",
            }}
          >
            <Box mt={3} style={{ width: "300px" }}>
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
                style={{ width: "200px", height: "40px" }}
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
