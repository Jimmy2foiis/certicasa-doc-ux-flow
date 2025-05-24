
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  User, 
  Sparkles, 
  Eye,
  ArrowUpRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import StatCard from "@/components/dashboard/StatCard";
import FinancesSummary from "@/components/dashboard/FinancesSummary";
import { recentProjects } from "@/data/mock";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const handleViewAllProjects = () => {
    navigate("/projects");
  };
  
  const handleViewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Projets" 
          value="428" 
          icon={<Home className="h-6 w-6" />}
          details={[
            { label: "En cours", value: "187" },
            { label: "Terminés", value: "241" },
          ]}
          trend={12}
          className="border-l-4 border-blue-500"
        />
        
        <StatCard 
          title="Clients" 
          value="312" 
          icon={<User className="h-6 w-6" />}
          details={[
            { label: "Actifs", value: "245" },
            { label: "Inactifs", value: "67" },
          ]}
          trend={8}
          className="border-l-4 border-emerald-500"
        />
        
        <StatCard 
          title="Économies Thermiques" 
          value="1.24 M" 
          unit="kWh"
          icon={<Sparkles className="h-6 w-6" />}
          details={[
            { label: "Économies (€)", value: "€198,400" },
            { label: "Moyenne", value: "€42/m²" },
          ]}
          trend={23}
          className="border-l-4 border-amber-500"
        />
      </div>

      {/* Section Performance Financière */}
      <FinancesSummary />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <span>Projets Récents</span>
              <Button variant="outline" size="sm" className="text-xs" onClick={handleViewAllProjects}>
                Voir tout
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du projet</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.client}</TableCell>
                    <TableCell>{project.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.status === "Terminé" ? "success" :
                          project.status === "En cours" ? "default" :
                          "outline"
                        }
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewProject(project.id)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Résumé des performances</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Documents générés</span>
                <span className="font-medium">67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Calculs terminés</span>
                <span className="font-medium">89%</span>
              </div>
              <Progress value={89} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Signatures collectées</span>
                <span className="font-medium">72%</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Projets facturés</span>
                <span className="font-medium">54%</span>
              </div>
              <Progress value={54} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
