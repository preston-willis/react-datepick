import Timer from "react-compound-timer";
import React, { useState } from "react";
import TimerOffIcon from "@material-ui/icons/TimerOff";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TimerIcon from "@material-ui/icons/Timer";
import { Button, Box } from "@material-ui/core";
import ms from "ms";

interface Inputs {
  refreshInterval: number;
  refreshIntervalUnits: string;
  timerRunning: boolean;
  applyFn(): void;
  resetFn(): void;
}

export function TimerUI(props: Inputs) {
  function determineInitialTime() {
    let time =
      ms(String(props.refreshInterval) + props.refreshIntervalUnits) - 1;
    if (time > 1000 * 60 * 60 * 24) {
      return 1000 * 60 * 60 * 24 - 1;
    } else {
      return time;
    }
  }

  function resetTimer() {
    props.resetFn();
    props.applyFn();
  }

  if (props.timerRunning == true) {
    return (
      <Timer
        initialTime={determineInitialTime()}
        direction="backward"
        checkpoints={[
          {
            time: 0,
            callback: () => resetTimer(),
          },
        ]}
      >
        <Box>
          <TimerIcon />
          <ExpandMoreIcon />
        </Box>
      </Timer>
    );
  } else {
    return (
      <Box>
        <TimerOffIcon />
        <ExpandMoreIcon />
      </Box>
    );
  }
}
