import React from "react";
import { Box } from "@material-ui/core";
import { DateRange, TermContext } from "./DateRange.tsx";
import { RelativeDateSelectDropdown } from "./RelativeDateSelectDropdown.tsx";

interface Inputs {
  termAnchorEl: any;
  intervalAnchorEl: any;
  quickSelectTerms: string[];
  quickSelectIntervals: number[];
  quickSelectContent: number[];
  classes: any;
  dateRange: DateRange;
  handleClick(text: number): void;
  setTermAnchorEl(element: EventTarget | null): void;
  setIntervalAnchorEl(element: EventTarget | null): void;
}

export const DateSelect: React.FC<Inputs> = (props) => {
  enum menu {
    term = 0,
    interval = 1,
  }

  function getAnchorEl(identifier: number): Element {
    if (identifier == menu.term) {
      return props.termAnchorEl;
    } else {
      return props.intervalAnchorEl;
    }
  }

  function setAnchorEl(identifier: number, item: EventTarget | null): void {
    if (identifier == menu.term) {
      props.setTermAnchorEl(item);
    } else {
      props.setIntervalAnchorEl(item);
    }
  }

  function handleMenuClick(identifier: number, event: EventTarget): void {
    setAnchorEl(identifier, event);
  }

  function handleClose(identifier: number, item: any): void {
    setAnchorEl(identifier, null);
    let words = props.quickSelectContent;
    words[identifier] = item;
    props.handleClick(words[0] * words[1]);
  }

  function getDropdownObj(index: number) {
    return {
      firstDropdownText: props.quickSelectTerms,
      secondDropdownText: props.quickSelectIntervals,
      relativeSelectContent: props.quickSelectContent,
      dropdownType: TermContext.quickSelect,
      handleClose,
      dateRange: props.dateRange,
      handleMenuClick,
      getAnchorEl,
      classes: props.classes,
      identifier: index,
    };
  }

  return (
    <Box className={props.classes.flexRow}>
      <Box>
        <RelativeDateSelectDropdown {...getDropdownObj(0)} />
      </Box>
      <Box ml={1}>
        <RelativeDateSelectDropdown {...getDropdownObj(1)} />
      </Box>
    </Box>
  );
};
