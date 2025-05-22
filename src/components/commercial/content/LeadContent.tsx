
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Phone,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ClipboardCheck
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Exemple de données pour les leads
const mockLeads = {
  new: [
    { id: 1, name: "Dupont Marc", status: "Nouveau", date: "20/05/2025", phone: "06 12 34 56 78", email: "dupont.marc@email.com", source: "Site web" },
    { id: 2, name: "Martin Sophie", status: "Nouveau", date: "20/05/2025", phone: "06 23 45 67 89", email: "sophie.martin@email.com", source: "Partenaire" },
    { id: 3, name: "Bernard Jean", status: "Nouveau", date: "20/05/2025", phone: "06 34 56 78 90", email: "jean.bernard@email.com", source: "Salon" },
    { id: 4, name: "Petit Lucie", status: "Nouveau", date: "19/05/2025", phone: "06 45 67 89 01", email: "lucie.petit@email.com", source: "Facebook" },
    { id: 5, name: "Robert Michel", status: "Nouveau", date: "19/05/2025", phone: "06 56 78 90 12", email: "michel.robert@email.com", source: "Recommandation" },
  ],
  qualification: [
    { id: 6, name: "Leroy Pierre", status: "Qualification", date: "18/05/2025", phone: "06 67 89 01 23", email: "pierre.leroy@email.com", source: "LinkedIn", notes: "En attente de validation du besoin" },
    { id: 7, name: "Dubois Anne", status: "Qualification", date: "18/05/2025", phone: "06 78 90 12 34", email: "anne.dubois@email.com", source: "Instagram", notes: "A rappeler pour compléter les informations" },
    { id: 8, name: "Moreau Paul", status: "Qualification", date: "17/05/2025", phone: "06 89 01 23 45", email: "paul.moreau@email.com", source: "Google", notes: "Intéressé par l'isolation des combles" },
  ],
  confirmed: [
    { id: 9, name: "Moreau Claude", status: "Confirmé", date: "16/05/2025", phone: "06 90 12 34 56", email: "claude.moreau@email.com", source: "Site web", notes: "Rendez-vous technique planifié", appointment: "23/05/2025" },
    { id: 10, name: "Petit Christine", status: "Confirmé", date: "15/05/2025", phone: "06 01 23 45 67", email: "christine.petit@email.com", source: "Recommandation", notes: "Prêt pour visite technique", appointment: "22/05/2025" },
  ],
  rejected: [
    { id: 11, name: "Lambert François", status: "Rejeté", date: "14/05/2025", phone: "06 12 34 56 78", email: "francois.lambert@email.com", source: "Facebook", reason: "Zone non couverte" },
    { id: 12, name: "Simon Marie", status: "Rejeté", date: "13/05/2025", phone: "06 23 45 67 89", email: "marie.simon@email.com", source: "Instagram", reason: "Non intéressé" },
  ]
};

const LeadContent = () => {
  const [leads, setLeads] = useState(mockLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"kanban" | "list">("kanban");

  // Fonction de filtrage des leads
  const filterLeads = (leads: any[], term: string) => {
    if (!term) return leads;
    return leads.filter(lead => 
      lead.name.toLowerCase().includes(term.toLowerCase()) || 
      lead.email?.toLowerCase().includes(term.toLowerCase())
    );
  };

  // Fonction pour déplacer un lead d'une colonne à l'autre
  const moveLead = (leadId: number, fromStatus: string, toStatus: string) => {
    // Implémentation simple pour la démo
    const leadIndex = leads[fromStatus as keyof typeof leads].findIndex(lead => lead.id === leadId);
    if (leadIndex !== -1) {
      const lead = {...leads[fromStatus as keyof typeof leads][leadIndex], status: toStatus};
      const newLeads = {
        ...leads,
        [fromStatus]: leads[fromStatus as keyof typeof leads].filter(lead => lead.id !== leadId),
        [toStatus]: [...leads[toStatus as keyof typeof leads], lead]
      };
      setLeads(newLeads);
    }
  };

  // Rendu d'une carte de lead
  const renderLeadCard = (lead: any, columnKey: string) => (
    <Card key={lead.id} className="mb-3 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
      <CardHeader className="pb-2 pt-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-semibold">{lead.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Phone className="mr-2 h-4 w-4" /> Appeler
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ClipboardCheck className="mr-2 h-4 w-4" /> Affecter
              </DropdownMenuItem>
              {columnKey === "new" && (
                <DropdownMenuItem onClick={() => moveLead(lead.id, "new", "qualification")}>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Passer en qualification
                </DropdownMenuItem>
              )}
              {columnKey === "qualification" && (
                <DropdownMenuItem onClick={() => moveLead(lead.id, "qualification", "confirmed")}>
                  <Calendar className="mr-2 h-4 w-4" /> Confirmer RDV
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-red-500">
                <AlertCircle className="mr-2 h-4 w-4" /> Rejeter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="text-xs flex items-center">
          <Badge variant="outline" className="bg-blue-50 text-blue-800 mr-2">
            {lead.source}
          </Badge>
          {lead.date}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="text-sm space-y-1">
          <div className="flex items-center text-muted-foreground">
            <Phone className="h-3.5 w-3.5 mr-1" />
            <span>{lead.phone}</span>
          </div>
          {lead.notes && (
            <div className="text-xs text-muted-foreground mt-2 italic">
              {lead.notes}
            </div>
          )}
          {lead.appointment && (
            <div className="text-xs flex items-center mt-2 text-green-600">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>RDV: {lead.appointment}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-3">
        {columnKey === "new" ? (
          <Button size="sm" variant="outline" className="w-full" 
                 onClick={() => moveLead(lead.id, "new", "qualification")}>
            Qualifier
          </Button>
        ) : columnKey === "qualification" ? (
          <Button size="sm" variant="outline" className="w-full"
                 onClick={() => moveLead(lead.id, "qualification", "confirmed")}>
            Confirmer
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );

  // Rendu d'une colonne de Kanban
  const renderLeadColumn = (title: string, columnKey: string, variant: "default" | "outline", bgColor: string) => {
    const filteredLeads = filterLeads(leads[columnKey as keyof typeof leads], searchTerm);
    
    return (
      <Card className={`h-full flex flex-col`}>
        <CardHeader className={`${bgColor} pb-2 flex-shrink-0`}>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <span>{title}</span>
              <Badge variant={variant} className="ml-2">{filteredLeads.length}</Badge>
            </CardTitle>
          </div>
          <CardDescription>
            {columnKey === "new" ? "Prospects à qualifier" : 
             columnKey === "qualification" ? "En cours de qualification" :
             columnKey === "confirmed" ? "Prêts pour visite technique" :
             "Leads non convertis"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-3">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-3">
              {filteredLeads.map(lead => renderLeadCard(lead, columnKey))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Gestion des Leads</h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher un lead..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap">
              <UserPlus className="mr-2 h-4 w-4" /> Nouveau Lead
            </Button>
          </div>
        </div>

        <Tabs defaultValue="kanban" className="mb-6" onValueChange={(value) => setView(value as "kanban" | "list")}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="kanban" className="flex-1 sm:flex-none">Vue Kanban</TabsTrigger>
            <TabsTrigger value="list" className="flex-1 sm:flex-none">Liste</TabsTrigger>
          </TabsList>
          
          <TabsContent value="kanban" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[calc(100vh-230px)]">
              {renderLeadColumn("Nouveaux", "new", "outline", "bg-blue-50")}
              {renderLeadColumn("En Qualification", "qualification", "outline", "bg-amber-50")}
              {renderLeadColumn("Confirmés", "confirmed", "outline", "bg-green-50")}
              {renderLeadColumn("Rejetés", "rejected", "outline", "bg-red-50")}
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Liste des leads</CardTitle>
                <CardDescription>Vue détaillée de tous les leads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(leads).flatMap(([status, statusLeads]) => 
                    filterLeads(statusLeads, searchTerm).map(lead => (
                      <div key={lead.id} className="p-3 border rounded-md flex justify-between items-center">
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-muted-foreground">{lead.phone} • {lead.email}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline"
                            className={
                              status === "new" ? "bg-blue-50 text-blue-800" :
                              status === "qualification" ? "bg-amber-50 text-amber-800" :
                              status === "confirmed" ? "bg-green-50 text-green-800" :
                              "bg-red-50 text-red-800"
                            }
                          >
                            {lead.status}
                          </Badge>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LeadContent;
