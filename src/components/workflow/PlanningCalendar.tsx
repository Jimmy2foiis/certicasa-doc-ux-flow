
import React from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { filterEvents } from "./utils/planningUtils";
import { PlanningCalendarProps } from "./types/planningTypes";
import { usePlanningEvents } from "./hooks/usePlanningEvents";
import { usePlanningFilters } from "./hooks/usePlanningFilters";
import { usePlanningNavigation } from "./hooks/usePlanningNavigation";

// Components
import PlanningHeader from "./components/PlanningHeader";
import PlanningNavigation from "./components/PlanningNavigation";
import UnassignedEventsPanel from "./components/UnassignedEventsPanel";
import EventListView from "./components/EventListView";
import TeamCalendarView from "./components/TeamCalendarView";

export const PlanningCalendar = ({
  initialDate = new Date(),
  initialView = "week",
  clientId
}: PlanningCalendarProps) => {
  // Hooks
  const {
    events,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleAddEvent
  } = usePlanningEvents();
  
  const {
    searchQuery,
    setSearchQuery,
    selectedTeam,
    setSelectedTeam,
    selectedType,
    setSelectedType,
    clientIdParam
  } = usePlanningFilters();
  
  const {
    date,
    view,
    setView,
    handlePreviousDay,
    handleNextDay,
    handleToday
  } = usePlanningNavigation(initialDate, initialView);
  
  // Filter events based on criteria
  const filteredEvents = filterEvents(
    events,
    searchQuery,
    selectedTeam,
    selectedType,
    clientIdParam || clientId || null
  );
  
  // Separate unassigned and assigned events
  const unassignedEvents = filteredEvents.filter(event => event.status === "unassigned");
  const assignedEvents = filteredEvents.filter(event => event.status !== "unassigned");

  return (
    <div className="h-full flex flex-col">
      {/* Header with title and view buttons */}
      <PlanningHeader
        clientIdParam={clientIdParam || clientId || null}
        view={view}
        setView={setView}
        handleToday={handleToday}
        handleAddEvent={handleAddEvent}
      />

      {/* Navigation and filters */}
      <PlanningNavigation
        date={date}
        view={view}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        handlePreviousDay={handlePreviousDay}
        handleNextDay={handleNextDay}
      />

      {/* Main content */}
      <div className="flex-grow overflow-hidden mb-2">
        {view === "list" ? (
          <EventListView filteredEvents={filteredEvents} />
        ) : (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Unassigned events panel */}
            <ResizablePanel defaultSize={15} minSize={10} maxSize={30} className="border-r">
              <UnassignedEventsPanel
                unassignedEvents={unassignedEvents}
                handleDragStart={handleDragStart}
              />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Team calendar panel */}
            <ResizablePanel defaultSize={85} className="overflow-auto">
              <TeamCalendarView
                assignedEvents={assignedEvents}
                handleDragStart={handleDragStart}
                handleDragOver={handleDragOver}
                handleDrop={handleDrop}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
};

export default PlanningCalendar;
