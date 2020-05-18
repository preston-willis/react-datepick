import React, { useContext } from "react";
import { Divider } from "@material-ui/core";
import { Button, Box, Typography } from "@material-ui/core";
import { DateSelect } from "./QuickDateSelect";
import { DateRange, TermContext } from "./DateRange";
import { GlobalContext } from "./Constants";
import { DateRangeUI, DropdownData } from "./Types";
import { MSFormatter } from "./MSFormatter";

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

  let commonlyUsedFirstRow = globals.commonlyUsedText.slice(
    0,
    Math.floor(globals.commonlyUsedText.length / 2)
  );

  let commonlyUsedSecondRow = globals.commonlyUsedText.slice(
    Math.floor(globals.commonlyUsedText.length / 2),
    8
  );

  function getRecentlySelectedFirstRow(): number[] {
    return props.recentlySelected.slice(
      0,
      Math.floor(props.recentlySelected.length / 2)
    );
  }

  function getRecentlySelectedSecondRow(): number[] {
    return props.recentlySelected.slice(
      Math.floor(props.recentlySelected.length / 2)
    );
  }

  function handleClick(text: number): void {
    out = MSFormatter.splitMilliseconds(text);
    props.setDropdownData({ ...props.dropdownData, quickSelectContent: out });
  }

  function apply(): void {
    let dateRange = props.dateRange;
    dateRange.setQuickSelect(props.dropdownData.quickSelectContent);
    props.applyChanges(dateRange);

    let recentlySelected = props.recentlySelected;
    recentlySelected.unshift(
      props.dropdownData.quickSelectContent[0] *
        props.dropdownData.quickSelectContent[1]
    );
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
              {commonlyUsedFirstRow.map((object) => (
                <Box key={commonlyUsedFirstRow.indexOf(object)}>
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
              {commonlyUsedSecondRow.map((object) => (
                <Box key={commonlyUsedSecondRow.indexOf(object)}>
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
              {getRecentlySelectedFirstRow().map((object) => (
                <Box key={getRecentlySelectedFirstRow().indexOf(object)}>
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
              {getRecentlySelectedSecondRow().map((object) => (
                <Box key={getRecentlySelectedSecondRow().indexOf(object)}>
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
