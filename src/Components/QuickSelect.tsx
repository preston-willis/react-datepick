import React, { useContext } from "react";
import { Divider } from "@material-ui/core";
import { Button, Box, Typography } from "@material-ui/core";
import { DateSelect } from "./QuickDateSelect";
import { DateRange, TermContext } from "./../objects/DateRange";
import { GlobalContext } from "./../objects/Constants";
import { DateRangeUI, DropdownData } from "./../objects/Types";
import { MSFormatter } from "./../objects/MSFormatter";

interface Inputs {
  boxClass: string;
  recentlySelected: number[];
  dateRange: DateRange;
  dateRangeUI: DateRangeUI;
  dropdownData: DropdownData;
  setDropdownData(data: DropdownData): void;
  setDateRangeUI(dateRangeUI: DateRangeUI): void;
  applyChanges(dr: DateRange): void;
  setRecentlySelected(items: number[]): void;
}

export const QuickSelect: React.FC<Inputs> = (props) => {
  const globals = useContext(GlobalContext);
  let out = props.dropdownData.quickSelectContent;

  const comUseMid = Math.floor(globals.commonlyUsedText.length / 2);
  const recSelMid = Math.floor(props.recentlySelected.length / 2);
  let commonlyUsedColumns: number[][] = [
    globals.commonlyUsedText.slice(0, comUseMid),
    globals.commonlyUsedText.slice(comUseMid),
  ];

  let recentlySelectedColumns: number[][] = [
    props.recentlySelected.slice(0, recSelMid),
    props.recentlySelected.slice(recSelMid),
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
    let recentlySelected = props.recentlySelected;
    recentlySelected.unshift(
      props.dropdownData.quickSelectContent[0] *
        props.dropdownData.quickSelectContent[1]
    );

    // If recentlySelected exceeds its maximum size, remove the last value
    if (recentlySelected.length > 6) {
      recentlySelected.pop();
    }
    props.setRecentlySelected(recentlySelected);
  }

  function getDateSelectObj() {
    return {
      handleClick,
      dateRange: props.dateRange,
      classes: globals.classes,
      dropdownData: props.dropdownData,
      setDropdownData: props.setDropdownData,
    };
  }

  return (
    <Box className={props.boxClass}>
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
            <Box className={globals.classes.flexColumn}>
              {commonlyUsedColumns[0].map((object, index) => (
                <Box key={commonlyUsedColumns[0][index]}>
                  <Button
                    onClick={() => handleClick(object)}
                    color="primary"
                    variant="text"
                    size="small"
                    disableFocusRipple={true}
                    disableRipple={true}
                    className={globals.classes.quickSelectContainerButton}
                  >
                    {""}
                  </Button>
                  <Box mt={-3}>
                    <Typography color="primary" variant="subtitle2">
                      {MSFormatter.millisecondsToHumanized(
                        MSFormatter.splitMilliseconds(object),
                        TermContext.quickSelect,
                        globals.localeObj
                      ).join(" ")}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box className={globals.classes.flexColumn}>
              {commonlyUsedColumns[1].map((object) => (
                <Box key={commonlyUsedColumns[1].indexOf(object)}>
                  <Button
                    onClick={() => handleClick(object)}
                    color="primary"
                    variant="text"
                    size="small"
                    disableFocusRipple={true}
                    disableRipple={true}
                    className={globals.classes.quickSelectContainerButton}
                  >
                    {""}
                  </Button>
                  <Box mt={-3}>
                    <Typography color="primary" variant="subtitle2">
                      {MSFormatter.millisecondsToHumanized(
                        MSFormatter.splitMilliseconds(object),
                        TermContext.quickSelect,
                        globals.localeObj
                      ).join(" ")}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box ml={2} mt={2} className={globals.classes.flexColumn}>
          <Divider light />
          <Box mt={1} />
          <Typography color="textPrimary" variant="subtitle1">
            Recently used date ranges
          </Typography>
          <Box mt={1} className={globals.classes.flexRow}>
            <Box className={globals.classes.flexColumn}>
              {recentlySelectedColumns[0].map((object) => (
                <Box key={recentlySelectedColumns[0].indexOf(object)}>
                  <Button
                    onClick={() => handleClick(object)}
                    color="primary"
                    variant="text"
                    size="small"
                    disableFocusRipple={true}
                    disableRipple={true}
                    className={globals.classes.quickSelectContainerButton}
                  >
                    {""}
                  </Button>
                  <Box mt={-3}>
                    <Typography color="primary" variant="subtitle2">
                      {MSFormatter.millisecondsToHumanized(
                        MSFormatter.splitMilliseconds(object),
                        TermContext.quickSelect,
                        globals.localeObj
                      ).join(" ")}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box className={globals.classes.flexColumn}>
              {recentlySelectedColumns[1].map((object) => (
                <Box key={recentlySelectedColumns[1].indexOf(object)}>
                  <Button
                    onClick={() => handleClick(object)}
                    color="primary"
                    variant="text"
                    size="small"
                    disableFocusRipple={true}
                    disableRipple={true}
                    className={globals.classes.quickSelectContainerButton}
                  >
                    {""}
                  </Button>
                  <Box mt={-3}>
                    <Typography color="primary" variant="subtitle2">
                      {MSFormatter.millisecondsToHumanized(
                        MSFormatter.splitMilliseconds(object),
                        TermContext.quickSelect,
                        globals.localeObj
                      ).join(" ")}
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
