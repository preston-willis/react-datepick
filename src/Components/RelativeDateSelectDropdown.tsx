import React, { useState, useEffect } from "react";
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
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { DateType, DateRange, TermContext } from "./DateRange.tsx";

interface Inputs {
  identifier: number;
  firstDropdownText: any[];
  secondDropdownText: any[];
  relativeSelectContent: number[];
  classes: any;
  dropdownType: TermContext;
  dateRange: DateRange;
  handleMenuClick(identifier: number, event: EventTarget): void;
  handleClose(identifier: number, item: any): void;
  getAnchorEl(identifier: number): Element;
}

export const RelativeDateSelectDropdown: React.FC<Inputs> = (props) => {
  let term = props.firstDropdownText;
  let interval = props.secondDropdownText;

  enum menu {
    term = 0,
    interval = 1,
  }

  const displayTerm = (item) => {
    return props.dateRange.multiplierToHumanized(item, props.dropdownType);
  };

  const displayInterval = (item) => {
    return props.dateRange.localeObj.humanizer(item);
  };

  let displayFn: (item: any) => any;
  let list: any = [];
  if (props.identifier == menu.term) {
    list = [-1, 1];
    displayFn = displayTerm;
  } else if (props.identifier == menu.interval) {
    list = interval;
    displayFn = displayInterval;
  }

  return (
    <div>
      <Button
        className={props.classes.bodyDateSelectDropdownButton}
        aria-controls={String(props.identifier)}
        variant="outlined"
        color="primary"
        aria-haspopup="true"
        onClick={(event) =>
          props.handleMenuClick(props.identifier, event.currentTarget)
        }
      >
        <Box className={props.classes.flexRow}>
          {
            props.dateRange.millisecondsToHumanized(
              props.relativeSelectContent,
              props.dropdownType
            )[props.identifier]
          }
          <Box ml={1} />
          <ExpandMoreIcon />
        </Box>
      </Button>
      <Menu
        id={String(props.identifier)}
        anchorEl={props.getAnchorEl(props.identifier)}
        keepMounted
        open={Boolean(props.getAnchorEl(props.identifier))}
        onClose={() =>
          props.handleClose(
            props.identifier,
            props.relativeSelectContent[props.identifier]
          )
        }
      >
        {list.map((item) => (
          <MenuItem onClick={() => props.handleClose(props.identifier, item)}>
            {displayFn(item)}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
