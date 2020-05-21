import React, { useContext } from "react";
import {
  Button,
  Box,
  FormGroup,
  FormControlLabel,
  Switch,
  TextField,
  Menu,
  MenuItem,
} from "@material-ui/core";

import { GlobalContext } from "./../objects/Constants";
import { RefreshData } from "./../objects/Types";

interface Inputs {
  menuClass: string;
  refreshData: RefreshData;
  setRefreshData(refreshData: RefreshData): void;
  setAnchorEl(element: EventTarget | null): void;
  anchorEl: any;
  setTimerRunning(isRunning: boolean): void;
  timerRunning: boolean;
  setMenuError(error: boolean): void;
  menuError: boolean;
}

export const MenuView: React.FC<Inputs> = (props) => {
  const globals = useContext(GlobalContext);

  function applyChanges() {
    props.setTimerRunning(true);
  }

  function toggleSwitch(): void {
    if (props.refreshData.refreshIntervalEnabled) {
      props.setRefreshData({
        ...props.refreshData,
        refreshIntervalEnabled: false,
      });
      props.setTimerRunning(false);
    } else {
      props.setRefreshData({
        ...props.refreshData,
        refreshIntervalEnabled: true,
      });
    }
  }

  function handleTextChange(event: string): void {
    if (isNaN(parseFloat(event))) {
      props.setMenuError(true);
    } else {
      props.setRefreshData({
        ...props.refreshData,
        refreshInterval: parseFloat(event),
      });
      props.setMenuError(false);
    }
  }

  function handleClick(event: EventTarget): void {
    props.setAnchorEl(event);
  }

  function handleClose(item: string): void {
    props.setAnchorEl(null);
    props.setRefreshData({ ...props.refreshData, refreshIntervalUnits: item });
  }

  function setDefaultValue(): string | number {
    if (props.refreshData.refreshInterval != -1) {
      return props.refreshData.refreshInterval;
    } else {
      return "";
    }
  }

  return (
    <Box mt={2} className={props.menuClass}>
      <Box mt={2} ml={2}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                size="medium"
                checked={props.refreshData.refreshIntervalEnabled}
                onChange={() => toggleSwitch()}
              />
            }
            label="Timer"
          />
        </FormGroup>
      </Box>
      <Box ml={2} mt={1} display="flex" flexDirection="row" alignItems="center">
        <TextField
          error={props.menuError}
          helperText={props.menuError}
          onChange={(event) => handleTextChange(event.target.value)}
          size="small"
          defaultValue={setDefaultValue()}
          disabled={!props.refreshData.refreshIntervalEnabled}
          id="outlined-basic"
          label="Refresh Interval"
          variant="outlined"
        />
        <Button
          disabled={!props.refreshData.refreshIntervalEnabled}
          className={globals.classes.menuEnableButton}
          aria-controls="simple-menu"
          variant="outlined"
          color="primary"
          aria-haspopup="true"
          onClick={(event) => handleClick(event.currentTarget)}
        >
          {props.refreshData.refreshIntervalUnits}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={props.anchorEl}
          keepMounted
          open={Boolean(props.anchorEl)}
          onClose={() => handleClose(props.refreshData.refreshIntervalUnits)}
        >
          <MenuItem onClick={() => handleClose("Seconds")}>Seconds</MenuItem>
          <MenuItem onClick={() => handleClose("Minutes")}>Minutes</MenuItem>
          <MenuItem onClick={() => handleClose("Hours")}>Hours</MenuItem>
        </Menu>
      </Box>
      <Box mt={1} ml={2} className={globals.classes.menuTimerButtonsContainer}>
        <Box>
          <Button
            disabled={
              !props.refreshData.refreshIntervalEnabled || props.menuError
            }
            className={globals.classes.menuTimerStateButton}
            aria-controls="simple-menu"
            variant="contained"
            color="primary"
            aria-haspopup="true"
            onClick={() => applyChanges()}
          >
            Apply
          </Button>
        </Box>
        <Box ml={1}>
          <Button
            disabled={!props.timerRunning}
            className={globals.classes.menuTimerStateButton}
            variant="contained"
            color="primary"
            onClick={() => props.setTimerRunning(false)}
          >
            Stop
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
