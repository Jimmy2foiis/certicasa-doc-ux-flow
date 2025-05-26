// Mock data for CertiCasa Doc app

// Recent projects for dashboard
export const recentProjects = [
  {
    id: "PRJ001",
    name: "Rénovation Énergétique Maison Dupont",
    client: "Jean Dupont",
    date: "05/05/2025",
    status: "En cours"
  },
  {
    id: "PRJ002",
    name: "Isolation Thermique Résidence Les Pins",
    client: "Marie Martin",
    date: "02/05/2025",
    status: "Terminé"
  },
  {
    id: "PRJ003",
    name: "Panneaux Solaires Villa Mercier",
    client: "Pierre Mercier",
    date: "29/04/2025",
    status: "En attente"
  },
  {
    id: "PRJ004",
    name: "Diagnostic Énergétique Appt. Bernard",
    client: "Sophie Bernard",
    date: "27/04/2025",
    status: "En cours"
  },
  {
    id: "PRJ005",
    name: "Remplacement Chauffage Maison Petit",
    client: "Thomas Petit",
    date: "25/04/2025",
    status: "Terminé"
  }
];

// Client data
export const clientsData = [
  {
    id: "1",
    name: "Juan Pérez Martínez",
    email: "juan.perez@mail.com",
    phone: "+34 612 345 678",
    projects: 2,
    status: "Activo",
    nif: "X-1234567-Z",
    type: "010"
  },
  {
    id: "2",
    name: "María Sánchez López",
    email: "maria.sanchez@mail.com",
    phone: "+34 623 456 789",
    projects: 1,
    status: "Activo",
    nif: "Y-2345678-A",
    type: "020"
  },
  {
    id: "3",
    name: "Carlos López García",
    email: "carlos.lopez@mail.com",
    phone: "+34 634 567 890",
    projects: 1,
    status: "Activo",
    nif: "Z-3456789-B",
    type: "010"
  },
  {
    id: "4",
    name: "Ana García Fernández",
    email: "ana.garcia@mail.com",
    phone: "+34 645 678 901",
    projects: 1,
    status: "Inactivo",
    nif: "X-4567890-C",
    type: "020"
  },
  {
    id: "5",
    name: "Luis Martínez Romero",
    email: "luis.martinez@mail.com",
    phone: "+34 656 789 012",
    projects: 1,
    status: "Activo",
    nif: "Y-5678901-D",
    type: "010"
  }
];

// Client documents
export const clientDocuments = [
  {
    id: "1",
    name: "Certificado de actuación RES010",
    project: "Rehabilitación fachada norte",
    status: "Firmado"
  },
  {
    id: "2",
    name: "Memoria técnica de cálculo",
    project: "Rehabilitación fachada norte",
    status: "Generado"
  },
  {
    id: "3",
    name: "Contrato de obra",
    project: "Rehabilitación fachada norte",
    status: "Firmado"
  },
  {
    id: "4",
    name: "Factura #FAC-2023-428",
    project: "Rehabilitación fachada norte",
    status: "Generado"
  },
  {
    id: "5",
    name: "Justificante de subvención",
    project: "Rehabilitación fachada norte",
    status: "Pendiente"
  }
];

// Document types
export const documentTypes = [
  {
    id: "1",
    name: "Certificado de actuación",
    description: "Documento principal de certificación RES",
    status: "Firmado"
  },
  {
    id: "2",
    name: "Memoria técnica",
    description: "Detalle de cálculos y especificaciones técnicas",
    status: "Generado"
  },
  {
    id: "3",
    name: "Contrato de obra",
    description: "Acuerdo entre cliente y empresa",
    status: "Firmado"
  },
  {
    id: "4",
    name: "Factura",
    description: "Factura detallada del servicio",
    status: "Generado"
  },
  {
    id: "5",
    name: "Fotografías",
    description: "Imágenes del antes y después",
    status: "Pendiente"
  },
  {
    id: "6",
    name: "DNI del cliente",
    description: "Documento de identidad escaneado",
    status: "Pendiente"
  },
  {
    id: "7",
    name: "Justificante subvención",
    description: "Documento para MITECO",
    status: "Pendiente"
  },
  {
    id: "8",
    name: "Certificado de materiales",
    description: "Especificaciones de materiales utilizados",
    status: "Exportado"
  }
];
