
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const AdvancedTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres avancés</CardTitle>
        <CardDescription>
          Configuration avancée de l'espace commercial
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">Clé API</Label>
          <Input id="api-key" defaultValue="sk_live_51JH12KJHASD81231231ASDASHD" type="password" />
        </div>
        
        <div className="pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="debug-mode">Mode de débogage</Label>
              <div className="text-sm text-muted-foreground">
                Activer le mode de débogage pour l'assistance technique
              </div>
            </div>
            <Switch id="debug-mode" />
          </div>
        </div>
        
        <div className="pt-4">
          <Button variant="destructive">
            Réinitialiser tous les paramètres
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedTab;
