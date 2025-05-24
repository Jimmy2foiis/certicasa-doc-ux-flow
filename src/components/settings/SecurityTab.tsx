
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SecurityTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sécurité du compte</CardTitle>
        <CardDescription>
          Gérez la sécurité de votre compte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Changer de mot de passe</h3>
            <div className="space-y-2">
              <Label htmlFor="current-password">Mot de passe actuel</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button className="mt-2">Mettre à jour le mot de passe</Button>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-medium">Authentification à deux facteurs</h3>
                <p className="text-sm text-gray-500">
                  Ajouter une couche de sécurité supplémentaire à votre compte
                </p>
              </div>
              <Switch />
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="space-y-2">
              <h3 className="text-base font-medium text-red-600">Zone de danger</h3>
              <p className="text-sm text-gray-500">
                Une fois que vous supprimez votre compte, il n'y a pas de retour en arrière. Veuillez être certain.
              </p>
              <Button variant="destructive">Supprimer le compte</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityTab;
