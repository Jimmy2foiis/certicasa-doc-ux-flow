
import { PlanningEvent, Team } from "../types/planningTypes";

// Sample teams data
export const teams: Team[] = [
  { id: "1", name: "RA Eco Bat 1", color: "bg-blue-600" },
  { id: "2", name: "RA Eco Bat 2", color: "bg-green-500" },
  { id: "3", name: "RA Eco Bat 3", color: "bg-cyan-500" },
  { id: "4", name: "Service Technique", color: "bg-amber-500" },
  { id: "5", name: "Léo Certicasa", color: "bg-purple-500" },
  { id: "6", name: "Pit Certicasa", color: "bg-pink-500" },
];

// Sample events data
export const sampleEvents: PlanningEvent[] = [
  {
    id: "1",
    clientId: "37330",
    clientName: "Jonathan Calvo",
    title: "Installation isolation",
    type: "installation",
    date: "2025-05-22",
    startTime: "11:00",
    endTime: "15:00",
    team: "RA Eco Bat 1",
    teamId: "1",
    status: "pending",
    notes: "Accès par le portail principal"
  },
  {
    id: "2",
    clientId: "42637",
    clientName: "Javier Pérez",
    title: "Visite technique",
    type: "visit",
    date: "2025-05-22",
    startTime: "14:00",
    endTime: "16:00",
    team: "RA Eco Bat 2",
    teamId: "2",
    status: "in-progress",
    notes: "Client prévenu par SMS"
  },
  {
    id: "3",
    clientId: "18475",
    clientName: "Marie Dupont",
    title: "SAV fenêtres",
    type: "sav",
    date: "2025-05-22",
    startTime: "09:00",
    endTime: "10:30",
    teamId: "",
    team: "",
    status: "unassigned",
    notes: "Urgent - à programmer rapidement"
  },
  {
    id: "4",
    clientId: "27965",
    clientName: "Carlos Rodriguez",
    title: "Mesures finales",
    type: "measure",
    date: "2025-05-22",
    startTime: "16:30",
    endTime: "18:00",
    teamId: "",
    team: "",
    status: "unassigned",
    notes: "Rendez-vous confirmé par téléphone"
  }
];
