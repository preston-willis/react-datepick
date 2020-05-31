import React, { useContext, useEffect } from "react";
import { Box } from "@material-ui/core";
import { DateRange, TermContext } from "../objects/DateRange";
import { RelativeDateSelectDropdown } from "./RelativeDateSelectDropdown";
import { DropdownData } from "../objects/Types";
import { GlobalContext } from "../objects/Constants";
import { MSFormatter } from "../objects/MSFormatter";

interface Inputs {
  classes: any;
  dateRange: DateRange;
  handleClick(text: number): void;
  dropdownData: DropdownData;
  setDropdownData(data: DropdownData): void;
}

export const DateSelect: React.FC<Inputs> = props => {
  let globals = useContext(GlobalContext);
  let out = props.dropdownData.quickSelectContent;

  enum menu {
    term = 0,
    interval = 1
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

  useEffect(() => {
    if (!props.dropdownData.termAnchorEl) {
      props.setDropdownData({ ...props.dropdownData, quickSelectContent: out });
    }
  }, [out, props, props.dropdownData.termAnchorEl]);

  useEffect(() => {
    if (!props.dropdownData.intervalAnchorEl) {
      props.setDropdownData({ ...props.dropdownData, quickSelectContent: out });
    }
  }, [out, props, props.dropdownData.intervalAnchorEl]);

  function handleClose(identifier: number, item: any): void {
    setAnchorEl(identifier, null);
    let words = props.dropdownData.quickSelectContent;
    words[identifier] = item;
    out = MSFormatter.splitMilliseconds(words[0] * words[1]);
  }

  const dropdownProps = {
    dropdownType: TermContext.quickSelect,
    content: props.dropdownData.quickSelectContent,
    handleClose,
    dateRange: props.dateRange,
    handleMenuClick,
    getAnchorEl,
    firstDropdownText: [-1, 1],
    secondDropdownText: globals.quickSelectIntervals,
    classes: props.classes
  };

  return (
    <Box className={props.classes.flexRow}>
      <Box>
        <RelativeDateSelectDropdown {...dropdownProps} identifier={0} />
      </Box>
      <Box ml={1}>
        <RelativeDateSelectDropdown {...dropdownProps} identifier={1} />
      </Box>
    </Box>
  );
};
