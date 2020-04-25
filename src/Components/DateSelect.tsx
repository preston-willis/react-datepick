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

interface Inputs {
  quickSelectText: string[];
  termAnchorEl: any;
  intervalAnchorEl: any;
  timeIntervalText: string[][];
  terms: string[];
  intervals: string[];
  handleClick(w): void;
  setTermAnchorEl(x): void;
  setIntervalAnchorEl(y): void;
  setQuickSelectText(z): void;
}

export function DateSelect(props: Inputs) {
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
    props.handleClick(props.quickSelectText);
  }

  function renderdropdownMenu(identifier) {
    var term = props.terms;
    var interval = props.intervals;

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
  );
}
