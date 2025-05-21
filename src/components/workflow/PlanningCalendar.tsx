
import React from "react";
import { PlanningCalendarProps } from "./types/planningTypes";
import { PlanningCalendarContainer } from "./components/planning/PlanningCalendarContainer";

export const PlanningCalendar = (props: PlanningCalendarProps) => {
  return <PlanningCalendarContainer {...props} />;
};

export default PlanningCalendar;
