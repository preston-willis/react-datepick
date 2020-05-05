import React, { useState, useEffect } from "react";
import { Divider } from "@material-ui/core";
import ms from "ms";
import {
  Button,
  Box,
  Typography,
  GridList,
  GridListTile,
  TextField,
  Grid,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { DateSelect } from "./QuickDateSelect.tsx";
import DateRange from "./DateRange.tsx";

interface Inputs {
  boxClass: string;
  recentlySelected: string[][];
  termAnchorEl: any;
  intervalAnchorEl: any;
  commonlyUsedText: string[][];
  quickSelectIntervals: string[];
  quickSelectTerms: string[];
  timeFormat: string;
  quickSelectContent: string[];
  classes: any;
  formatDateTextField(dates?: DateRange): void;
  formatTimeTextField(dates?: DateRange): void;
  setDateRange(dateRange: DateRange): void;
  setQuickSelectContent(content: string[]): void;
  dateRange: DateRange;
  applyChanges(): void;
  getDateRange(dates: Date[]): void;
  setRecentlySelected(items: string[][]): void;
  setTermAnchorEl(element: EventTarget | null): void;
  setIntervalAnchorEl(element: EventTarget | null): void;
}

export const QuickSelect: React.FC<Inputs> = (props) => {
  function handleClick(text: string[]): void {
    props.setQuickSelectContent(text);
  }

  function apply(): void {
    let dateRange = props.dateRange;
    dateRange.setQuickSelect(props.quickSelectContent);
    props.formatDateTextField();
    props.formatTimeTextField();
    props.setDateRange(dateRange);
    props.applyChanges();

    let recentlySelected = props.recentlySelected;
    recentlySelected.unshift(props.quickSelectContent);
    if (recentlySelected.length > 6) {
      recentlySelected.pop();
    }
    props.setRecentlySelected(recentlySelected);
  }

  function getDateSelectObj() {
    return {
      quickSelectContent: props.quickSelectContent,
      handleClick,
      classes: props.classes,
      termAnchorEl: props.termAnchorEl,
      intervalAnchorEl: props.intervalAnchorEl,
      setTermAnchorEl: props.setTermAnchorEl,
      setIntervalAnchorEl: props.setIntervalAnchorEl,
      quickSelectTerms: props.quickSelectTerms,
      quickSelectIntervals: props.quickSelectIntervals,
    };
  }

  return (
    <Box className={props.boxClass}>
      <Box className={props.classes.flexColumn}>
        <Box ml={2} mt={2}>
          <Typography variant="subtitle1" color="textPrimary">
            Quick Select
          </Typography>
          <Box mt={1} className={props.classes.flexRow}>
            <DateSelect {...getDateSelectObj()} />
            <Box ml={1}>
              <Button
                onClick={() => apply()}
                variant="contained"
                color="primary"
                className={props.classes.quickSelectApplyButton}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
        <Box ml={2} mt={2} className={props.classes.flexColumn}>
          <Divider light />
          <Box mt={1} />
          <Typography color="textPrimary" variant="subtitle1">
            Commonly used
          </Typography>
          <Box className={props.classes.flexRow}>
            <Box className={props.classes.flexColumn}>
              {props.commonlyUsedText.slice(0, 4).map((object) => (
                <Box>
                  <Button
                    onClick={() => handleClick(object)}
                    color="primary"
                    variant="text"
                    size="small"
                    disableFocusRipple={true}
                    disableRipple={true}
                    className={props.classes.quickSelectContainerButton}
                  ></Button>
                  <Box mt={-3}>
                    <Typography color="primary" variant="subtitle2">
                      {object.join(" ")}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box className={props.classes.flexColumn}>
              {props.commonlyUsedText.slice(4, 8).map((object) => (
                <Box>
                  <Button
                    onClick={() => handleClick(object)}
                    color="primary"
                    variant="text"
                    size="small"
                    disableFocusRipple={true}
                    disableRipple={true}
                    className={props.classes.quickSelectContainerButton}
                  ></Button>
                  <Box mt={-3}>
                    <Typography color="primary" variant="subtitle2">
                      {object.join(" ")}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box ml={2} mt={2} className={props.classes.flexColumn}>
          <Divider light />
          <Box mt={1} />
          <Typography color="textPrimary" variant="subtitle1">
            Recently used date ranges
          </Typography>
          <Box mt={1} className={props.classes.flexRow}>
            <Box className={props.classes.flexColumn}>
              {props.recentlySelected
                .slice(0, Math.floor(props.recentlySelected.length / 2))
                .map((object) => (
                  <Box>
                    <Button
                      onClick={() => handleClick(object)}
                      color="primary"
                      variant="text"
                      size="small"
                      disableFocusRipple={true}
                      disableRipple={true}
                      className={props.classes.quickSelectContainerButton}
                    ></Button>
                    <Box mt={-3}>
                      <Typography color="primary" variant="subtitle2">
                        {object.join(" ")}
                      </Typography>
                    </Box>
                  </Box>
                ))}
            </Box>
            <Box className={props.classes.flexColumn}>
              {props.recentlySelected
                .slice(Math.floor(props.recentlySelected.length / 2))
                .map((object) => (
                  <Box>
                    <Button
                      onClick={() => handleClick(object)}
                      color="primary"
                      variant="text"
                      size="small"
                      disableFocusRipple={true}
                      disableRipple={true}
                      className={props.classes.quickSelectContainerButton}
                    ></Button>
                    <Box mt={-3}>
                      <Typography color="primary" variant="subtitle2">
                        {object.join(" ")}
                      </Typography>
                    </Box>
                  </Box>
                ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
