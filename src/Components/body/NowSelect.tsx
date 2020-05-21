import React, { useContext } from "react";
import "./../../objects/Styling.css";
import { DateRange } from "./../../objects/DateRange";
import { GlobalContext } from "./../../objects/Constants";
import { Button, Box, Typography } from "@material-ui/core";

interface Inputs {
  applyMasterChanges(dr: DateRange): void;
  dateRange: DateRange;
  index: number;
}

export const NowSelect: React.FC<Inputs> = (props) => {
  const globals = useContext(GlobalContext);

  function setNow(): void {
    let dateRange = props.dateRange;
    dateRange.setNow(props.index);
    props.applyMasterChanges(dateRange);
  }

  return (
    <Box className={globals.classes.bodyDateSelectDropdown}>
      <Box mt={3} className={globals.classes.bodySetNow}>
        <Typography>
          Setting time to now means that on every refresh, the current time will
          be reset.
        </Typography>
      </Box>
      <Box mt={3}>
        <Button
          onClick={() => setNow()}
          variant="contained"
          color="primary"
          className={globals.classes.bodySetNowButton}
        >
          Set time to now
        </Button>
      </Box>
    </Box>
  );
};
