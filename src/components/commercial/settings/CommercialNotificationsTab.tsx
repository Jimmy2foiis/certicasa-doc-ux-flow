
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const CommercialNotificationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres des notifications</CardTitle>
        <CardDescription>
          Configurez les notifications pour l'espace commercial
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new-leads">Nouveaux leads</Label>
              <div className="text-sm text-muted-foreground">
                Notifications pour les nouveaux leads ajoutés
              </div>
            </div>
            <Switch id="new-leads" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="qualification">Rappels de qualification</Label>
              <div className="text-sm text-muted-foreground">
                Rappels pour les qualifications en attente
              </div>
            </div>
            <Switch id="qualification" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="planning">Alertes planning</Label>
              <div className="text-sm text-muted-foreground">
                Notifications pour les rendez-vous à venir
              </div>
            </div>
            <Switch id="planning" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="stock">Alertes de stock</Label>
              <div className="text-sm text-muted-foreground">
                Notifications pour les produits en stock faible
              </div>
            </div>
            <Switch id="stock" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommercialNotificationsTab;
