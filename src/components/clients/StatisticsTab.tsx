
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface StatisticsTabProps {
  clientId: string;
}

const StatisticsTab = ({ clientId }: StatisticsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques</CardTitle>
        <CardDescription>Analyse des données client</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center border rounded-lg">
          <p className="text-muted-foreground">Graphiques et statistiques à venir</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsTab;
