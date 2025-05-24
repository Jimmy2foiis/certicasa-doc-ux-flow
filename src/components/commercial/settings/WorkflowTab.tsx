
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const WorkflowTab = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Configuration du workflow</CardTitle>
          <CardDescription>
            Personnalisez le processus de suivi commercial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Étapes du pipeline commercial</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {['Lead', 'Qualification', 'Devis envoyé', 'Devis signé', 'Visite technique', 'Pose', 'Terminé'].map((step, index) => (
                  <div key={index} className="flex items-center p-2 border rounded-md">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 mr-2">
                      {index + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-qualification">Qualification automatisée</Label>
                  <div className="text-sm text-muted-foreground">
                    Utiliser des règles pour qualifier automatiquement les leads
                  </div>
                </div>
                <Switch id="auto-qualification" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Délais et rappels</CardTitle>
          <CardDescription>
            Configurez les délais et rappels automatiques
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="followup-delay">Délai de relance (jours)</Label>
              <Input id="followup-delay" type="number" defaultValue="3" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote-expiry">Expiration des devis (jours)</Label>
              <Input id="quote-expiry" type="number" defaultValue="30" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowTab;
