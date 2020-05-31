import React, { useContext, useState } from "react";
import { Divider } from "@material-ui/core";
import { Button, Box, Typography } from "@material-ui/core";
import { DateSelect } from "./QuickDateSelect";
import { DateRange, TermContext } from "../objects/DateRange";
import { GlobalContext } from "../objects/Constants";
import { DateRangeUI, DropdownData } from "../objects/Types";
import { MSFormatter } from "../objects/MSFormatter";
import { QuickSelectColumn } from "./QuickSelectColumn";

interface Inputs {
  boxClass: string;
  applyChanges(dr: DateRange): void;
  dateRange: DateRange;
  setDateRangeUI(dateRangeUI: DateRangeUI): void;
  dateRangeUI: DateRangeUI;
  setDropdownData(data: DropdownData): void;
  dropdownData: DropdownData;
}

export const QuickSelect: React.FC<Inputs> = props => {
  const globals = useContext(GlobalContext);
  const [recentlySelected, setRecentlySelected] = useState<number[]>([]);

  let out = props.dropdownData.quickSelectContent;

  const comUseMid = Math.floor(globals.commonlyUsedText.length / 2);
  const recSelMid = Math.floor(recentlySelected.length / 2);
  let commonlyUsedColumns: number[][] = [
    globals.commonlyUsedText.slice(0, comUseMid),
    globals.commonlyUsedText.slice(comUseMid)
  ];

  let recentlySelectedColumns: number[][] = [
    recentlySelected.slice(0, recSelMid),
    recentlySelected.slice(recSelMid)
  ];

  function handleClick(text: number): void {
    out = MSFormatter.splitMilliseconds(text);
    props.setDropdownData({ ...props.dropdownData, quickSelectContent: out });
  }

  function apply(): void {
    let dateRange = props.dateRange;
    dateRange.setQuickSelect(props.dropdownData.quickSelectContent);
    props.applyChanges(dateRange);

    // Add the current value to recentlySelected
    let recentlySelectedTemp = recentlySelected;
    recentlySelectedTemp.unshift(
      props.dropdownData.quickSelectContent[0] *
        props.dropdownData.quickSelectContent[1]
    );

    // If recentlySelected exceeds its maximum size, remove the last value
    if (recentlySelectedTemp.length > 6) {
      recentlySelectedTemp.pop();
    }
    setRecentlySelected(recentlySelectedTemp);
  }

  function getDateSelectObj() {
    return {
      handleClick,
      dateRange: props.dateRange,
      classes: globals.classes,
      dropdownData: props.dropdownData,
      setDropdownData: props.setDropdownData
    };
  }

  return (
    <Box className={globals.classes[props.boxClass]}>
      <Box className={globals.classes.flexColumn}>
        <Box ml={2} mt={2}>
          <Typography variant="subtitle1" color="textPrimary">
            Quick Select
          </Typography>
          <Box mt={1} className={globals.classes.flexRow}>
            <DateSelect {...getDateSelectObj()} />
            <Box ml={1}>
              <Button
                onClick={() => apply()}
                variant="contained"
                color="primary"
                className={globals.classes.quickSelectApplyButton}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
        <Box ml={2} mt={2} className={globals.classes.flexColumn}>
          <Divider light />
          <Box mt={1} />
          <Typography color="textPrimary" variant="subtitle1">
            Commonly used
          </Typography>
          <Box className={globals.classes.flexRow}>
            <QuickSelectColumn
              content={commonlyUsedColumns[0]}
              handleClick={handleClick}
            />
            <QuickSelectColumn
              content={commonlyUsedColumns[1]}
              handleClick={handleClick}
            />
          </Box>
        </Box>
        <Box ml={2} mt={2} className={globals.classes.flexColumn}>
          <Divider light />
          <Box mt={1} />
          <Typography color="textPrimary" variant="subtitle1">
            Recently used date ranges
          </Typography>
          <Box mt={1} className={globals.classes.flexRow}>
            <QuickSelectColumn
              content={recentlySelectedColumns[0]}
              handleClick={handleClick}
            />
            <QuickSelectColumn
              content={recentlySelectedColumns[1]}
              handleClick={handleClick}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
