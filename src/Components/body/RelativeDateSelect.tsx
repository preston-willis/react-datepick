import React, { useContext } from "react";
import { DateRange, TermContext } from "./../../objects/DateRange";
import { Box } from "@material-ui/core";
import { RelativeDateSelectDropdown } from "./../RelativeDateSelectDropdown";
import { DropdownData } from "./../../objects/Types";
import { GlobalContext } from "./../../objects/Constants";

interface Inputs {
  classes: any;
  dateRange: DateRange;
  applyFn(text: number): void;
  dropdownData: DropdownData;
  setDropdownData(data: DropdownData): void;
}

export const DateSelect: React.FC<Inputs> = (props) => {
  const globals = useContext(GlobalContext);

  enum menu {
    term = 0,
    interval = 1,
  }

  function getAnchorEl(identifier: number): Element {
    if (identifier == menu.term) {
      return props.dropdownData.termAnchorEl;
    } else {
      return props.dropdownData.intervalAnchorEl;
    }
  }

  function setAnchorEl(identifier: number, item: EventTarget | null): void {
    if (identifier == menu.term) {
      props.setDropdownData({ ...props.dropdownData, termAnchorEl: item });
    } else {
      props.setDropdownData({ ...props.dropdownData, intervalAnchorEl: item });
    }
  }

  function handleMenuClick(identifier: number, event: EventTarget): void {
    setAnchorEl(identifier, event);
  }

  function handleClose(identifier: number, item: number): void {
    setAnchorEl(identifier, null);
    let words = props.dropdownData.relativeSelectContent;
    words[identifier] = item;
    props.applyFn(words[0] * words[1]);
  }

  const dropdownProps = {
    firstDropdownText: [-1, 1],
    secondDropdownText: globals.relativeIntervals,
    content: props.dropdownData.relativeSelectContent,
    handleClose,
    dropdownType: TermContext.relative,
    dateRange: props.dateRange,
    classes: props.classes,
    handleMenuClick,
    getAnchorEl,
  };

  return (
    <Box className={props.classes.flexRow}>
      <Box>
        <RelativeDateSelectDropdown {...dropdownProps} identifier={1} />
      </Box>
      <Box ml={1}>
        <RelativeDateSelectDropdown {...dropdownProps} identifier={0} />
      </Box>
    </Box>
  );
};
