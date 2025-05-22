
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClientData } from "@/hooks/useClientData";
import { 
  BarChart, 
  FileText, 
  Clock, 
  CalendarCheck, 
  TrendingUp,
  Activity,
  BarChart2
} from "lucide-react";

interface StatisticsTabProps {
  clientId: string;
}

// Timeline activity component
const Timeline = ({ activities }: { activities: any[] }) => {
  return (
    <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 before:h-full before:w-0.5 before:bg-border before:ml-7">
      {activities.map((activity, index) => (
        <div key={index} className="flex gap-4 relative">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mt-2 relative z-10">
            <activity.icon className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <Card>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{activity.title}</CardTitle>
                    <CardDescription>{activity.description}</CardDescription>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {activity.date}
                  </span>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
};

const StatisticsTab = ({ clientId }: StatisticsTabProps) => {
  const { client } = useClientData(clientId);
  
  if (!client) return null;
  
  // Mock activities - in a real app, these would come from various tables
  const activities = [
    {
      title: "Dossier créé",
      description: "Le dossier client a été initialisé",
      date: "15/02/2023",
      icon: FileText
    },
    {
      title: "Documents ajoutés",
      description: "3 photos et factures ajoutées",
      date: "20/02/2023",
      icon: FileText
    },
    {
      title: "Rendez-vous",
      description: "Visite technique effectuée",
      date: "01/03/2023",
      icon: CalendarCheck
    },
    {
      title: "Subvention CEE approuvée",
      description: "Dossier accepté par l'organisme",
      date: "15/03/2023",
      icon: TrendingUp
    },
    {
      title: "Projet finalisé",
      description: "Installation terminée et validée",
      date: "30/03/2023",
      icon: Clock
    }
  ];
  
  // Mock KPIs - would be calculated from real data
  const kpis = {
    documentsCount: 12,
    documentsCompleted: 9,
    daysActive: 45,
    projectProgress: 75, // percentage
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques</CardTitle>
        <CardDescription>Analyse des données client</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              <span>Vue d'ensemble</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Chronologie</span>
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              <span>Graphiques</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-sm">Documents</p>
                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-semibold">
                        {kpis.documentsCompleted} / {kpis.documentsCount}
                      </p>
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${(kpis.documentsCompleted / kpis.documentsCount) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round((kpis.documentsCompleted / kpis.documentsCount) * 100)}% complétés
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-sm">Jours actifs</p>
                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-semibold">{kpis.daysActive}</p>
                      <CalendarCheck className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Client engagé depuis le 15/02/2023
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-sm">Avancement projet</p>
                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-semibold">{kpis.projectProgress}%</p>
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${kpis.projectProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Estimation: fin du projet en 15 jours
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-sm">Status</p>
                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-semibold">
                        {(client as any).status || "Actif"}
                      </p>
                      <Activity className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Dernière mise à jour: aujourd'hui
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Status timeline preview */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <Timeline activities={activities.slice(0, 3)} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="timeline">
            <Timeline activities={activities} />
          </TabsContent>
          
          <TabsContent value="charts">
            <div className="flex items-center justify-center h-64 border rounded-lg">
              <div className="text-center">
                <BarChart className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Graphiques et analyses détaillées à venir
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatisticsTab;
