import Timer from "react-compound-timer";
import React, { useState } from "react";
import ms from "ms";


interface Inputs {
  refreshInterval: number;
  refreshIntervalUnits: string;
  timerRunning: boolean;
  dates: Date[]
  resetDateOnRefresh: boolean[];
  resetFn(): void;
  setTimerRunning(x): void;
  setDates(g): void;
}

export function TimerUI(props: Inputs) {
  function determineInitialTime() {
    var time =
      ms(String(props.refreshInterval) + props.refreshIntervalUnits) - 1;
    if (time > 1000 * 60 * 60 * 24) {
      return 1000 * 60 * 60 * 24 - 1;
    } else {
      return time;
    }
  }

  function resetTimer() {
    var temp = props.dates
    var i;
    for (i=0; i<2; i++) {
      if (props.resetDateOnRefresh[i]) {
        temp[i] = new Date()
      }
      props.setDates(temp)
    }

    props.resetFn();
    props.setTimerRunning(false);
    props.setTimerRunning(true);
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
        <React.Fragment>
          {"Refresh in "}
          <Timer.Hours />
          {":"}
          <Timer.Minutes />
          {":"}
          <Timer.Seconds />
        </React.Fragment>
      </Timer>
    );
  } else {
    return <div>Refresh</div>;
  }
}
