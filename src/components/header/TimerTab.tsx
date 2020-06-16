import React, { useContext } from "react";
import { Button, Box } from "@material-ui/core";
import { GlobalContext } from "../../objects/Constants";
import { TimerUI } from "../Timer";
import { DateRange } from "../../objects/DateRange";
import { RefreshData } from "../../objects/Types";

interface Inputs {
  timerRunning: boolean;
  dateRange: DateRange;
  onTimerEvent?(): void;
  setTimerRunning(running: boolean): void;
  resetDateRange(dateRange: DateRange): void;
  onDateEvent(dates: Date[]): void;
  refreshData: RefreshData;
}

export const TimerTab: React.FC<Inputs> = props => {
  const globals = useContext(GlobalContext);

  function refreshTime(): void {
    props.dateRange.refreshDates();
    props.resetDateRange(props.dateRange);

    props.onDateEvent(props.dateRange.dates);
    props.setTimerRunning(false);
    props.setTimerRunning(true);
  }
  function renderTab() {
    if (props.onTimerEvent !== undefined) {
      return (
        <Box ml={1}>
          <Button
            color="primary"
            variant="contained"
            className={globals.classes.headerIconButton}
          >
            <TimerUI
              timerRunning={props.timerRunning}
              refreshInterval={props.refreshData.refreshInterval}
              refreshIntervalUnits={props.refreshData.refreshIntervalUnits}
              resetFn={props.onTimerEvent}
              applyFn={refreshTime}
            />
          </Button>
        </Box>
      );
    } else {
      return <Box />;
    }
  }
  return renderTab();
};
