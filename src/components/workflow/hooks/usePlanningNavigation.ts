
import { useState } from "react";

export const usePlanningNavigation = (initialDate = new Date(), initialView: "day" | "week" | "month" | "list" = "week") => {
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [view, setView] = useState<"day" | "week" | "month" | "list">(initialView);
  
  const handlePreviousDay = () => {
    if (date) {
      const newDate = new Date(date);
      if (view === "day") {
        newDate.setDate(newDate.getDate() - 1);
      } else if (view === "week") {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setMonth(newDate.getMonth() - 1);
      }
      setDate(newDate);
    }
  };

  const handleNextDay = () => {
    if (date) {
      const newDate = new Date(date);
      if (view === "day") {
        newDate.setDate(newDate.getDate() + 1);
      } else if (view === "week") {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      setDate(newDate);
    }
  };

  const handleToday = () => {
    setDate(new Date());
  };
  
  return {
    date,
    setDate,
    view,
    setView,
    handlePreviousDay,
    handleNextDay,
    handleToday
  };
};
