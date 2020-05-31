import React, { useContext } from "react";
import { DateRange } from "../../objects/DateRange";
import { GlobalContext } from "../../objects/Constants";
import KeyboardTabIcon from "@material-ui/icons/KeyboardTab";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Button, Box } from "@material-ui/core";

interface Inputs {
  dateRange: DateRange;
  timerRunning: boolean;
  applyChanges(dateRange: DateRange): void;
}

export const ApplyButton: React.FC<Inputs> = (props) => {
  const globals = useContext(GlobalContext);

  function getApplyText(): JSX.Element {
    if (props.timerRunning) {
      return (
        <Box className={globals.classes.flexRow}>
          <RefreshIcon />
          <Box ml={1} />
          Refresh
        </Box>
      );
    } else {
      return (
        <Box className={globals.classes.flexRow}>
          <KeyboardTabIcon />
          <Box ml={1} />
          Update
        </Box>
      );
    }
  }

  return (
    <Button
      onClick={() => props.applyChanges(props.dateRange)}
      variant="contained"
      color="primary"
      className={globals.classes.headerApplyButton}
    >
      {getApplyText()}
    </Button>
  );
};
