
import { Dossier } from "@/components/admin/AdminDashboard";

export const mockDossiers: Dossier[] = [
  {
    id: "1",
    clientName: "Martin Dupont",
    clientId: "CLI-2025-0037",
    contactPhone: "06 12 34 56 78",
    contactEmail: "martin.dupont@example.com",
    responsiblePerson: "Anna Latour",
    date: "15/05/2025",
    status: "en_attente",
    duration: "3 jours",
    documentsCount: 5,
    driveLink: "https://drive.google.com/folder/1abc123"
  },
  {
    id: "2",
    clientName: "Sophie Lefebvre",
    clientId: "CLI-2025-0038",
    contactPhone: "06 23 45 67 89",
    contactEmail: "sophie.lefebvre@example.com",
    responsiblePerson: "Marc Moreno",
    date: "16/05/2025",
    status: "termine",
    duration: "10 jours",
    documentsCount: 8,
    driveLink: "https://drive.google.com/folder/2def456"
  },
  {
    id: "3",
    clientName: "Jean Lambert",
    clientId: "CLI-2025-0039",
    contactPhone: "06 34 56 78 90",
    contactEmail: "jean.lambert@example.com",
    responsiblePerson: "Anna Latour",
    date: "17/05/2025",
    status: "en_attente",
    duration: "1 jour",
    documentsCount: 3,
    driveLink: "https://drive.google.com/folder/3ghi789"
  },
  {
    id: "4",
    clientName: "Marie Dubois",
    clientId: "CLI-2025-0040",
    contactPhone: "06 45 67 89 01",
    contactEmail: "marie.dubois@example.com",
    responsiblePerson: "Marc Moreno",
    date: "18/05/2025",
    status: "annule",
    duration: "5 jours",
    documentsCount: 2,
    driveLink: "https://drive.google.com/folder/4jkl012"
  },
  {
    id: "5",
    clientName: "Pierre Martin",
    clientId: "CLI-2025-0041",
    contactPhone: "06 56 78 90 12",
    contactEmail: "pierre.martin@example.com",
    responsiblePerson: "Anna Latour",
    date: "19/05/2025",
    status: "termine",
    duration: "7 jours",
    documentsCount: 8,
    driveLink: "https://drive.google.com/folder/5mno345"
  },
  {
    id: "6",
    clientName: "Julie Petit",
    clientId: "CLI-2025-0042",
    contactPhone: "06 67 89 01 23",
    contactEmail: "julie.petit@example.com",
    responsiblePerson: "Marc Moreno",
    date: "20/05/2025",
    status: "validation",
    duration: "2 jours",
    documentsCount: 6,
    driveLink: "https://drive.google.com/folder/6pqr678"
  }
];
