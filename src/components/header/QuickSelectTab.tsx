import React, { useContext } from "react";
import { GlobalContext } from "../../objects/Constants";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Button } from "@material-ui/core";
interface Inputs {
  handleClick(tab: number, event: any): void;
}
export const QuickSelectTab: React.FC<Inputs> = props => {
  const globals = useContext(GlobalContext);
  return (
    <Button
      onClick={event => {
        props.handleClick(0, event);
      }}
      color="primary"
      variant="contained"
      className={globals.classes.headerIconButton}
    >
      <CalendarTodayIcon />
      <ExpandMoreIcon />
    </Button>
  );
};
