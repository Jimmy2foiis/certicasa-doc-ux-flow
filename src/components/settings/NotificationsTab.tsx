
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const NotificationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences de notifications</CardTitle>
        <CardDescription>
          Configurez comment vous souhaitez recevoir les notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Notifications par email</h3>
              <p className="text-sm text-gray-500">
                Recevoir des emails pour les mises à jour importantes
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Alertes de stock</h3>
              <p className="text-sm text-gray-500">
                Notifications lorsqu'un produit est en stock faible
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Mises à jour de statut des lots</h3>
              <p className="text-sm text-gray-500">
                Notifications lorsque le statut d'un lot change
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Rapports hebdomadaires</h3>
              <p className="text-sm text-gray-500">
                Recevoir un résumé hebdomadaire des activités
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
