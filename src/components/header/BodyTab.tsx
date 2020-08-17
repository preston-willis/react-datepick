import React from "react";
import { Button, Box } from "@material-ui/core";
import { DateRange } from "../../objects/DateRange";
interface Inputs {
  dateRange: DateRange;
  index: number;
  handleClick(tab: number, event: any): void;
}
export const BodyTab: React.FC<Inputs> = props => {
  return (
    <Box>
      <Button
        onClick={event => {
          props.handleClick(props.index + 2, event);
        }}
        color="primary"
        variant="text"
      >
        {props.dateRange.finalDisplayText[props.index]}
      </Button>
    </Box>
  );
};
