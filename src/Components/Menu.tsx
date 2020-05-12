import React from "react";
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

interface Inputs {
  refreshIntervalEnabled: boolean;
  setRefreshIntervalEnabled(isEnabled: boolean): void;
  menuClass: string;
  classes: any;
  setAnchorEl(element: EventTarget | null): void;
  anchorEl: any;
  refreshIntervalUnits: string;
  setRefreshIntervalUnits(units: string): void;
  refreshInterval: number;
  setRefreshInterval(interval: number): void;
  setTimerRunning(isRunning: boolean): void;
  timerRunning: boolean;
  setMenuError(error: boolean): void;
  menuError: boolean;
}

export const MenuView: React.FC<Inputs> = (props) => {
  function applyChanges() {
    props.setTimerRunning(true);
  }

  function toggleSwitch(): void {
    if (props.refreshIntervalEnabled) {
      props.setRefreshIntervalEnabled(false);
      props.setTimerRunning(false);
    } else {
      props.setRefreshIntervalEnabled(true);
    }
  }

  function handleTextChange(event: string): void {
    if (isNaN(parseFloat(event))) {
      props.setMenuError(true);
    } else {
      props.setRefreshInterval(parseFloat(event));
      props.setMenuError(false);
    }
  }

  function handleClick(event: EventTarget): void {
    props.setAnchorEl(event);
  }

  function handleClose(item: string): void {
    props.setAnchorEl(null);
    props.setRefreshIntervalUnits(item);
  }

  function setDefaultValue(): string | number {
    if (props.refreshInterval != -1) {
      return props.refreshInterval;
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
                checked={props.refreshIntervalEnabled}
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
          disabled={!props.refreshIntervalEnabled}
          id="outlined-basic"
          label="Refresh Interval"
          variant="outlined"
        />
        <Button
          disabled={!props.refreshIntervalEnabled}
          className={props.classes.menuEnableButton}
          aria-controls="simple-menu"
          variant="outlined"
          color="primary"
          aria-haspopup="true"
          onClick={(event) => handleClick(event.currentTarget)}
        >
          {props.refreshIntervalUnits}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={props.anchorEl}
          keepMounted
          open={Boolean(props.anchorEl)}
          onClose={() => handleClose(props.refreshIntervalUnits)}
        >
          <MenuItem onClick={() => handleClose("Seconds")}>Seconds</MenuItem>
          <MenuItem onClick={() => handleClose("Minutes")}>Minutes</MenuItem>
          <MenuItem onClick={() => handleClose("Hours")}>Hours</MenuItem>
        </Menu>
      </Box>
      <Box mt={1} ml={2} className={props.classes.menuTimerButtonsContainer}>
        <Box>
          <Button
            disabled={!props.refreshIntervalEnabled || props.menuError}
            className={props.classes.menuTimerStateButton}
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
            className={props.classes.menuTimerStateButton}
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
