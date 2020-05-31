import React, { useContext } from "react";
import { GlobalContext } from "../../objects/Constants";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import {
  Button,
  Box,
  Typography,
  TextField,
  Grid,
  IconButton
} from "@material-ui/core";
import { DateRange } from "../../objects/DateRange";
import { DateRangeUI, BodyConfig } from "../../objects/Types";

interface Inputs {
  setBoxClass(boxClass: string): void;
  setDateRange(dateRange: DateRange): void;
  setDateRangeUI(dateRangeUI: DateRangeUI): void;
  setBodyConfig(config: BodyConfig): void;
  resetDate(key: string, value: any): void;
  handleClick(key: string, value: string | number): void;
  dateRangeUI: DateRangeUI;
  dateRange: DateRange;
  boxClass: string;
  index: number;
  bodyConfig: BodyConfig;
  property: any;
}

export const AbsoluteView: React.FC<Inputs> = props => {
  const globals = useContext(GlobalContext);

  function getTextTitle(): string {
    if (props.index == 1) {
      return "End Date";
    } else {
      return "Start Date";
    }
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
      })
    });
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
        { value: textYear }
      ] = dtf.formatToParts(newDate);

      if (
        parseInt(textDay) >= 0 &&
        parseInt(textMonth) >= 0 &&
        parseInt(textMonth) < 12 &&
        parseInt(textYear) > globals.minimumYearValue &&
        parseInt(textYear) < globals.maximumYearValue
      ) {
        props.resetDate(props.property.day, textDay);
        props.resetDate(props.property.month, String(parseInt(textMonth) - 1));
        props.resetDate(props.property.year, textYear);
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
        return index == props.index ? error : value;
      })
    });
  }

  const getVariant = (item: number) => {
    if (item == props.dateRange.dates[props.index].getDate()) {
      return "contained";
    } else {
      return "outlined";
    }
  };

  function updateTransition(index: number): void {
    if (props.bodyConfig.propertySelected == -1) {
      props.setBodyConfig({ ...props.bodyConfig, propertySelected: index });
      props.setBoxClass("boxWide");
    } else if (index == props.bodyConfig.propertySelected) {
      toggleBox();
    } else if (
      index != props.bodyConfig.propertySelected &&
      props.boxClass == "boxWide"
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

  function toggleBox(): void {
    if (props.boxClass == "box") {
      props.setBoxClass("boxWide");
    } else {
      props.setBoxClass("box");
    }
  }

  return (
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
                month: "long"
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
          {[...Array(7).keys()].map(item => (
            <Grid key={item} item>
              <Button
                disableRipple={true}
                color="secondary"
                size="small"
                variant="text"
                className={globals.classes.calendarButton}
              >
                {globals.localeObj.weekDays[item]}
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
            ).keys()
          ].map(item => (
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
          {[...Array(props.bodyConfig.daysInMonth[props.index]).keys()].map(
            item => (
              <Grid key={item} item>
                <Button
                  onClick={() => props.handleClick("day", item + 1)}
                  className={globals.classes.calendarButton}
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
          onChange={event => handleTextChange(event.target.value)}
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
          onChange={event => handleTimeChange(event.target.value)}
        />
      </Box>
    </Box>
  );
};
