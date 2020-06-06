import React, { useContext } from "react";
import { GlobalContext } from "../../objects/Constants";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Button } from "@material-ui/core";

export const QuickSelectTab: React.FC<{}> = () => {
  const globals = useContext(GlobalContext);
  return (
    <Button
      color="primary"
      variant="contained"
      className={globals.classes.headerIconButton}
    >
      <CalendarTodayIcon />
      <ExpandMoreIcon />
    </Button>
  );
};
