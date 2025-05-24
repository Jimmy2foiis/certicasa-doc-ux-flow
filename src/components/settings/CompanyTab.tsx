
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CompanyTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations Entreprise</CardTitle>
        <CardDescription>
          Gérez les informations de votre entreprise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Nom de l'entreprise</Label>
            <Input id="company-name" defaultValue="CertiCasa" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tax-id">Numéro fiscal</Label>
            <Input id="tax-id" defaultValue="ES B12345678" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input id="address" defaultValue="Calle Gran Vía, 12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input id="city" defaultValue="Madrid" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal-code">Code postal</Label>
            <Input id="postal-code" defaultValue="28013" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Pays</Label>
            <Input id="country" defaultValue="Espagne" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button>Enregistrer</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyTab;
