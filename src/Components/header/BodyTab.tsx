import React from "react";
import { Button, Box } from "@material-ui/core";
import { DateRange } from "../../objects/DateRange";
interface Inputs {
  dateRange: DateRange;
  index: number;
}
export const BodyTab: React.FC<Inputs> = props => {
  return (
    <Box ml={2}>
      <Button color="primary" variant="text">
        {props.dateRange.finalDisplayText[props.index]}
      </Button>
    </Box>
  );
};
