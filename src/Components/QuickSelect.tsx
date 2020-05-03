import React, { useState, useEffect } from "react";
import { Divider } from "@material-ui/core";
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
import { DateSelect } from "./QuickDateSelect.tsx";
import DateRange from "./DateRange.tsx";

interface Inputs {
  boxClass: string;
  recentlySelected: string[][];
  termAnchorEl: any;
  intervalAnchorEl: any;
  commonlyUsedText: string[][];
  quickSelectIntervals: string[];
  quickSelectTerms: string[];
  timeFormat: string;
  quickSelectContent: string[];
  setDateRange(h): void;
  setQuickSelectContent(r): void;
  dateRange: DateRange;
  applyChanges(): void;
  getData(f): void;
  setRecentlySelected(i): void;
  setTermAnchorEl(w): void;
  setIntervalAnchorEl(w): void;
}

export const QuickSelect: React.FC<Inputs> = (props) => {
  var dateRange: DateRange;

  useEffect(() => {
    dateRange = props.dateRange;
  }, []);

  function handleClick(text: string[]): void {
    props.setQuickSelectContent(text);
  }

  function apply(): void {
    dateRange = props.dateRange;
    dateRange.setQuickSelect(props.quickSelectContent);
    props.setDateRange(dateRange);
    props.applyChanges();

    var recentlySelected = props.recentlySelected;
    recentlySelected.unshift(props.quickSelectContent);
    if (recentlySelected.length > 6) {
      recentlySelected.pop();
    }
    props.setRecentlySelected(recentlySelected);
  }

  function getDateSelectObj() {
    return {
      quickSelectContent: props.quickSelectContent,
      handleClick,
      termAnchorEl: props.termAnchorEl,
      intervalAnchorEl: props.intervalAnchorEl,
      setTermAnchorEl: props.setTermAnchorEl,
      setIntervalAnchorEl: props.setIntervalAnchorEl,
      quickSelectTerms: props.quickSelectTerms,
      quickSelectIntervals: props.quickSelectIntervals,
    };
  }

  return (
    <Box className={props.boxClass}>
      <Box style={{ flexDirection: "column" }}>
        <Box ml={2} mt={2}>
          <Typography variant="subtitle1" color="textPrimary">
            Quick Select
          </Typography>
          <Box mt={1} style={{ display: "flex", flexDirection: "row" }}>
            <DateSelect {...getDateSelectObj()} />
            <Box ml={1}>
              <Button
                onClick={() => apply()}
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
          <Divider light />
          <Box mt={1} />
          <Typography color="textPrimary" variant="subtitle1">
            Commonly used
          </Typography>
          <Box style={{ display: "flex", flexDirection: "row" }}>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              {props.commonlyUsedText.slice(0, 4).map((object) => (
                <Box>
                  <Button
                    onClick={() => handleClick(object)}
                    color="primary"
                    variant="text"
                    size="small"
                    disableFocusRipple={true}
                    disableRipple={true}
                    style={{
                      backgroundColor: "transparent",
                      maxWidth: "150px",
                      minWidth: "150px",
                      maxHeight: "30px",
                      minHeight: "30px",
                    }}
                  ></Button>
                  <Box mt={-3}>
                    <Typography color="primary" variant="subtitle2">
                      {object.join(" ")}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              {props.commonlyUsedText.slice(4, 8).map((object) => (
                <Box>
                  <Button
                    onClick={() => handleClick(object)}
                    color="primary"
                    variant="text"
                    size="small"
                    style={{
                      textAlign: "left",
                      maxWidth: "150px",
                      minWidth: "150px",
                      maxHeight: "30px",
                      minHeight: "30px",
                    }}
                  ></Button>
                  <Box mt={-3}>
                    <Typography color="primary" variant="subtitle2">
                      {object.join(" ")}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box ml={2} mt={2} style={{ flexDirection: "column" }}>
          <Divider light />
          <Box mt={1} />
          <Typography color="textPrimary" variant="subtitle1">
            Recently used date ranges
          </Typography>
          <Box mt={1} style={{ display: "flex", flexDirection: "row" }}>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              {props.recentlySelected
                .slice(0, Math.floor(props.recentlySelected.length / 2))
                .map((object) => (
                  <Box>
                    <Button
                      onClick={() => handleClick(object)}
                      color="primary"
                      variant="text"
                      size="small"
                      style={{
                        textAlign: "left",
                        maxWidth: "150px",
                        minWidth: "150px",
                        maxHeight: "30px",
                        minHeight: "30px",
                      }}
                    ></Button>
                    <Box mt={-3}>
                      <Typography color="primary" variant="subtitle2">
                        {object.join(" ")}
                      </Typography>
                    </Box>
                  </Box>
                ))}
            </Box>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              {props.recentlySelected
                .slice(Math.floor(props.recentlySelected.length / 2))
                .map((object) => (
                  <Box>
                    <Button
                      onClick={() => handleClick(object)}
                      color="primary"
                      variant="text"
                      size="small"
                      style={{
                        textAlign: "left",
                        maxWidth: "150px",
                        minWidth: "150px",
                        maxHeight: "30px",
                        minHeight: "30px",
                      }}
                    ></Button>
                    <Box mt={-3}>
                      <Typography color="primary" variant="subtitle2">
                        {object.join(" ")}
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
