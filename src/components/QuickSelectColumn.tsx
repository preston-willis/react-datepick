import React, { useContext } from "react";
import { Button, Box, Typography } from "@material-ui/core";
import { GlobalContext } from "../objects/Constants";
import { MSFormatter } from "../objects/MSFormatter";
import { TermContext } from "../objects/DateRange";

interface Inputs {
  content: number[];
  handleClick(selectedObject: number): void;
}
export const QuickSelectColumn: React.FC<Inputs> = props => {
  const globals = useContext(GlobalContext);
  return (
    <Box className={globals.classes.flexColumn}>
      {props.content.map(object => (
        <Box key={props.content.indexOf(object)}>
          <Button
            onClick={() => props.handleClick(object)}
            color="primary"
            variant="text"
            size="small"
            disableFocusRipple={true}
            disableRipple={true}
            className={globals.classes.quickSelectContainerButton}
          >
            {""}
          </Button>
          <Box mt={-3}>
            <Typography color="primary" variant="subtitle2">
              {MSFormatter.millisecondsToHumanized(
                MSFormatter.splitMilliseconds(object),
                TermContext.quickSelect,
                globals.localeObj
              ).join(" ")}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
