import React, { Fragment } from "react";
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
import "./Styling.css";
import {
  format,
  formatDistance,
  formatRelative,
  subDays,
  getMonth,
  getDay,
  getYear,
} from "date-fns";

interface State {
  setDates(y): void;
  setBoxClass(z): void;
  setPropertySelected(a): void;
  setDateTextContents(c): void;
  setDateError(f): void;
  setDaysInMonth(g): void;
  getData(h): void;
  formatDateforDisplay(i): void;
  boxClass: string;
  index: number;
  dates: Date[];
  propertySelected: number;
  dateTextContents: string[];
  dateError: boolean[];
  daysInMonth: number[];
}

enum property {
  day = "day",
  month = "month",
  year = "year",
}

export function Body(props: State) {
  const day = ["S", "M", "T", "W", "T", "F", "S"];

  const getVariant = (item) => {
    if (item == props.dates[props.index].getDate()) {
      return "contained";
    } else {
      return "outlined";
    }
  };

  function toggleBox() {
    if (props.boxClass == "box") {
      props.setBoxClass("box-wide");
    } else {
      props.setBoxClass("box");
    }
  }

  function updateTransition(index) {
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

  function stateFormatter(value, getProp, setProp) {
    var temp = getProp;
    temp[props.index] = value;
    setProp([temp[0], temp[1]]);
  }

  function handleTextDate(event) {
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

  function handleClick(key, value) {
    resetDate(key, value);
    stateFormatter(
      props.formatDateforDisplay(props.index),
      props.dateTextContents,
      props.setDateTextContents
    );
  }

  function resetDate(key, value) {
    var date = props.dates[props.index];

    if (key == property.day) {
      date = new Date(date.getFullYear(), date.getMonth(), value);
    } else if (key == property.month) {
      date = new Date(date.getFullYear(), value, date.getDate());
    } else if (key == property.year) {
      date = new Date(value, date.getMonth(), date.getDate());
    }

    stateFormatter(date, props.dates, props.setDates);

    var daysInMonthContent = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    stateFormatter(daysInMonthContent, props.daysInMonth, props.setDaysInMonth);
    props.getData(props.dates);
  }

  function renderItem(index) {
    var key = property.year;
    var name = index;
    if (props.propertySelected == 0) {
      key = property.month;
      name = new Date(0, index + 1, 0).toLocaleString("default", {
        month: "long",
      });
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

  function renderScroll() {
    if (props.boxClass == "box-wide") {
      if (props.propertySelected == 1) {
        return (
          <Box mt={10}>
            <div style={{ overflow: "auto", maxHeight: 200, maxWidth: 120 }}>
              {" "}
              <ReactList
                itemRenderer={(index) => renderItem(index + 2000)}
                length={100}
                type="uniform"
              />
            </div>
          </Box>
        );
      } else {
        return (
          <Box mt={10}>
            <div style={{ overflow: "auto", maxHeight: 200, maxWidth: 120 }}>
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

  function getTextTitle() {
    if (props.index == 1) {
      return "End Date";
    } else {
      return "Start Date";
    }
  }

  return (
    <Box className={props.boxClass}>
      <Box className="box-container">
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
              {props.dates[props.index].toLocaleString("default", {
                month: "long",
              })}
            </Typography>
          </Box>
          <Box mt={2}>
            <Typography color="secondary" variant="h5">
              {props.dates[props.index].getFullYear()}
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
            {[...Array(props.daysInMonth[props.index]).keys()].map((item) => (
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
            ))}
          </Grid>
        </Box>
        <Box mt={7}>
          <TextField
            error={props.dateError[props.index]}
            fullWidth={true}
            value={props.dateTextContents[props.index]}
            size="small"
            id="outlined-basic"
            label={getTextTitle()}
            variant="outlined"
            onChange={(event) => handleTextDate(event.target.value)}
          />
        </Box>
      </Box>
      {renderScroll()}
    </Box>
  );
}
