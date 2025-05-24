
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const GeneralTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres généraux</CardTitle>
        <CardDescription>
          Configurez les paramètres généraux de l'espace commercial
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">Nom de l'entreprise</Label>
            <Input id="company" defaultValue="CertiCasa" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input id="address" defaultValue="123 rue de Paris, 75001 Paris" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" defaultValue="+33 1 23 45 67 89" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue="contact@certicasa.fr" type="email" />
          </div>
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-assign">Attribution automatique des leads</Label>
              <div className="text-sm text-muted-foreground">
                Attribuer automatiquement les nouveaux leads aux commerciaux
              </div>
            </div>
            <Switch id="auto-assign" defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralTab;
