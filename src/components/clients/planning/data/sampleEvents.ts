
import { PlanningEvent } from "@/components/workflow/types/planningTypes";

// Sample events data for testing
export const sampleEvents: PlanningEvent[] = [
  {
    id: "1",
    clientId: "sample-client-1",
    clientName: "Jean Dupont",
    title: "Installation fenêtres",
    date: "2025-05-22",
    startTime: "09:00",
    endTime: "12:00",
    team: "RA Eco Bat 1",
    teamId: "team-1",
    status: "pending",
    type: "installation",
    notes: "Accès par le portail principal"
  },
  {
    id: "2",
    clientId: "sample-client-1",
    clientName: "Jean Dupont",
    title: "Mesures et vérifications",
    date: "2025-05-20",
    startTime: "14:00",
    endTime: "16:00",
    team: "Service Technique",
    teamId: "team-2",
    status: "completed",
    type: "measure",
    notes: "Client absent, clé sous le pot"
  },
  {
    id: "3",
    clientId: "sample-client-1",
    clientName: "Jean Dupont",
    title: "SAV isolation murs",
    date: "2025-05-18",
    startTime: "10:00",
    endTime: "11:30",
    team: "RA Eco Bat 2",
    teamId: "team-3",
    status: "cancelled",
    type: "sav",
    notes: "Client a annulé pour raisons personnelles"
  },
  {
    id: "4",
    clientId: "sample-client-1",
    clientName: "Jean Dupont",
    title: "Visite commerciale",
    date: "2025-05-25",
    startTime: "15:00",
    endTime: "16:00",
    team: "Léo Certicasa",
    teamId: "team-4",
    status: "pending",
    type: "visit",
    notes: "Rendez-vous confirmé par SMS"
  }
];
