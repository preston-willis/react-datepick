import React, { useState } from "react";
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

class DateRange {
  text: string;
  startDate: Date;
  endDate: Date;

  constructor(text) {
    this.text = text;
    if (this.text.includes("next")) {
      this.startDate = new Date();
      this.endDate = new Date();
      this.endDate.setTime(this.startDate.getTime() + ms(this.text.slice(5)));
    } else {
      this.startDate = new Date();
      this.endDate = new Date();
      this.startDate.setTime(this.startDate.getTime() - ms(this.text.slice(5)));
    }
  }
}

interface Inputs {
  boxClass: string;
  recentlySelected: DateRange[];
  quickSelectText: string[];
  termAnchorEl: any;
  intervalAnchorEl: any;
  setTermAnchorEl(w): void;
  setIntervalAnchorEl(w): void;
  setQuickSelectText(z): void;
  setRecentlySelected(x): void;
  setDates(y): void;
}

export function QuickSelect(props: Inputs) {
  const timeIntervalObjects = [
    new DateRange("Last 15 Minutes"),
    new DateRange("Last 30 Minutes"),
    new DateRange("Last 1 Hour"),
    new DateRange("Last 24 hours"),
    new DateRange("Last 7 days"),
    new DateRange("Last 30 days"),
    new DateRange("Last 90 days"),
    new DateRange("Last 1 year"),
  ];

  enum menu {
    term = 0,
    interval = 1,
  }

  function getAnchorEl(identifier) {
    if (identifier == menu.term) {
      return props.termAnchorEl;
    } else {
      return props.intervalAnchorEl;
    }
  }

  function setAnchorEl(identifier, item) {
    if (identifier == menu.term) {
      props.setTermAnchorEl(item);
    } else {
      props.setIntervalAnchorEl(item);
    }
  }

  function handleClick(object) {
    props.setDates([object.startDate, object.endDate]);
    var recentlySelected = props.recentlySelected;
    recentlySelected.unshift(object);
    if (recentlySelected.length > 6) {
      recentlySelected.pop();
    }
    props.setRecentlySelected(recentlySelected);
  }

  function handleMenuClick(identifier, event) {
    setAnchorEl(identifier, event.currentTarget);
  }

  function handleClose(identifier, item) {
    setAnchorEl(identifier, null);
    var words = props.quickSelectText;
    words[identifier] = item;
    props.setQuickSelectText(words);
  }

  function applyChanges() {
    var dateRange = new DateRange(props.quickSelectText.join(" "));
    props.setDates([dateRange.startDate, dateRange.endDate]);
    handleClick(dateRange);
  }

  function renderdropdownMenu(identifier) {
    var term = ["last", "next"];
    var interval = [
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

    var list: string[] = [];
    if (identifier == menu.term) {
      list = term;
    } else if (identifier == menu.interval) {
      list = interval;
    }

    return (
      <div>
        <Button
          style={{ maxHeight: "40px", minHeight: "40px" }}
          aria-controls={String(identifier)}
          variant="outlined"
          color="primary"
          aria-haspopup="true"
          onClick={(event) => handleMenuClick(identifier, event)}
        >
          {props.quickSelectText[identifier]}
        </Button>
        <Menu
          id={String(identifier)}
          anchorEl={getAnchorEl(identifier)}
          keepMounted
          open={Boolean(getAnchorEl(identifier))}
          onClose={() =>
            handleClose(identifier, props.quickSelectText[identifier])
          }
        >
          {list.map((item) => (
            <MenuItem onClick={() => handleClose(identifier, item)}>
              {item}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }

  return (
    <Box className={props.boxClass}>
      <Box style={{ flexDirection: "column" }}>
        <Box ml={2} mt={2}>
          <Typography color="textPrimary" variant="h5">
            Quick Select
          </Typography>
          <Box mt={1} style={{ display: "flex", flexDirection: "row" }}>
            <Box>{renderdropdownMenu(menu.term)}</Box>
            <Box ml={1}>{renderdropdownMenu(menu.interval)}</Box>
            <Box ml={1}>
              <Button
                onClick={() => applyChanges()}
                variant="contained"
                color="primary"
                style={{
                  maxWidth: "80px",
                  minWidth: "80px",
                  maxHeight: "40px",
                  minHeight: "40px",
                }}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
        <Box ml={2} mt={2} style={{ display: "flex", flexDirection: "column" }}>
          <Typography color="textPrimary" variant="h5">
            Commonly used
          </Typography>
          <Box style={{ display: "flex", flexDirection: "row" }}>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              {timeIntervalObjects.slice(0, 4).map((object) => (
                <Button
                  onClick={() => handleClick(object)}
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
                  {object.text}
                </Button>
              ))}
            </Box>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              {timeIntervalObjects.slice(4, 8).map((object) => (
                <Button
                  onClick={() => handleClick(object)}
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
                  {object.text}
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
                    onClick={() => handleClick(object)}
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
                    {object.text}
                  </Button>
                ))}
            </Box>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              {props.recentlySelected
                .slice(Math.floor(props.recentlySelected.length / 2))
                .map((object) => (
                  <Button
                    onClick={() => handleClick(object)}
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
                    {object.text}
                  </Button>
                ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
