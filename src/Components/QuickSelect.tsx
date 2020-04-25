import React, { useState, useEffect } from "react";
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
import { DateSelect } from "./DateSelect.tsx";
import DateRange from "./DateRange.tsx";

interface Inputs {
  boxClass: string;
  recentlySelected: string[][];
  quickSelectText: string[];
  termAnchorEl: any;
  intervalAnchorEl: any;
  dates: Date[];
  timeIntervalText: string[][];
  timeFormat: string;
  setDisplayedDate(t): void;
  getData(f): void;
  setDateTextContents(f): void;
  setTimeTextContents(d): void;
  formatDateForDisplay(d): void;
  setTermAnchorEl(w): void;
  setIntervalAnchorEl(w): void;
  setQuickSelectText(z): void;
  setRecentlySelected(x): void;
  setDates(y): void;
}

export function QuickSelect(props: Inputs) {
  const terms = ["Last", "Next"];
  const intervals = [
    "1 minute",
    "15 minutes",
    "30 minutes",
    "1 hour",
    "6 hours",
    "12 hours",
    "1 day",
    "7 days",
    "30 days",
    "90 days",
    "1 year",
  ];

  useEffect(() => {
    props.setQuickSelectText(["Last", "15 minutes"])
  }, []);

  useEffect(() => {
    props.setDateTextContents([
      props.formatDateForDisplay(0),
      props.formatDateForDisplay(1),
    ]);
    props.setTimeTextContents([
      props.dates[0].toLocaleTimeString(props.timeFormat),
      props.dates[1].toLocaleTimeString(props.timeFormat),
    ]);
  }, [props.dates]);

  function handleClick(text) {
    var object = new DateRange(text.join(' '));
    object.quickSelectFormat();

    props.setDates([object.startDate, object.endDate]);
    props.getData([object.startDate, object.endDate])
    props.setDisplayedDate([object.startDate, object.endDate])

    var recentlySelected = props.recentlySelected;
    recentlySelected.unshift(text);
    if (recentlySelected.length > 6) {
      recentlySelected.pop();
    }
    props.setRecentlySelected(recentlySelected);
  }

  function getDateSelectObj() {
    return {
      quickSelectText: props.quickSelectText,
      termAnchorEl: props.termAnchorEl,
      intervalAnchorEl: props.intervalAnchorEl,
      timeIntervalText: props.timeIntervalText,
      handleClick,
      setTermAnchorEl: props.setTermAnchorEl,
      setIntervalAnchorEl: props.setIntervalAnchorEl,
      setQuickSelectText: props.setQuickSelectText,
      terms,
      intervals,
    };
  }

  return (
    <Box className={props.boxClass}>
      <Box style={{ flexDirection: "column" }}>
        <Box ml={2} mt={2}>
          <Typography color="textPrimary" variant="h5">
            Quick Select
          </Typography>
          <DateSelect {...getDateSelectObj()} />
        </Box>
        <Box ml={2} mt={2} style={{ display: "flex", flexDirection: "column" }}>
          <Typography color="textPrimary" variant="h5">
            Commonly used
          </Typography>
          <Box style={{ display: "flex", flexDirection: "row" }}>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              {props.timeIntervalText.slice(0, 4).map((object) => (
                <Button
                  onClick={() => props.setQuickSelectText(object)}
                  color="primary"
                  variant="text"
                  size="small"
                  style={{
                    maxWidth: "150px",
                    minWidth: "150px",
                    maxHeight: "30px",
                    minHeight: "30px",
                  }}
                >
                  {object.join(' ')}
                </Button>
              ))}
            </Box>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              {props.timeIntervalText.slice(4, 8).map((object) => (
                <Button
                  onClick={() => props.setQuickSelectText(object)}
                  color="primary"
                  variant="text"
                  size="small"
                  style={{
                    maxWidth: "150px",
                    minWidth: "150px",
                    maxHeight: "30px",
                    minHeight: "30px",
                  }}
                >
                  {object.join(' ')}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
        <Box ml={2} mt={2} style={{ flexDirection: "column" }}>
          <Typography color="textPrimary" variant="h5">
            Recently used date ranges
          </Typography>
          <Box mt={1} style={{ display: "flex", flexDirection: "row" }}>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              {props.recentlySelected
                .slice(0, Math.floor(props.recentlySelected.length / 2))
                .map((object) => (
                  <Button
                    onClick={() => props.setQuickSelectText(object)}
                    color="primary"
                    variant="text"
                    size="small"
                    style={{
                      maxWidth: "150px",
                      minWidth: "150px",
                      maxHeight: "30px",
                      minHeight: "30px",
                    }}
                  >
                    {object.join(' ')}
                  </Button>
                ))}
            </Box>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              {props.recentlySelected
                .slice(Math.floor(props.recentlySelected.length / 2))
                .map((object) => (
                  <Button
                    onClick={() => props.setQuickSelectText(object)}
                    color="primary"
                    variant="text"
                    size="small"
                    style={{
                      maxWidth: "150px",
                      minWidth: "150px",
                      maxHeight: "30px",
                      minHeight: "30px",
                    }}
                  >
                    {object.join(' ')}
                  </Button>
                ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
