import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const ProfileTab = () => {
  return <Card>
      <CardHeader>
        <CardTitle>Profil Utilisateur</CardTitle>
        <CardDescription>
          Gérez vos informations personnelles et préférences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" defaultValue="Jean Dupont" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="jean.dupont@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" type="tel" defaultValue="+33 6 12 34 56 78" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Input id="role" defaultValue="Administrateur" disabled />
          </div>
        </div>
        <div className="flex justify-end">
          <Button className="bg-green-600 hover:bg-green-700">Enregistrer</Button>
        </div>
      </CardContent>
    </Card>;
};
export default ProfileTab;