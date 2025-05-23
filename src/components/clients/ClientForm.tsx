import React, { useState } from "react";
import { Client } from "@/services/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateClientRecord } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

interface ClientFormProps {
  clientId: string;
  initialData?: Client;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ClientForm = ({ clientId, initialData, onSuccess, onCancel }: ClientFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>(initialData || {});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedClient = await updateClientRecord(clientId, formData);
      
      if (updatedClient) {
        toast({
          title: "Client mis à jour",
          description: "Les informations du client ont été mises à jour avec succès.",
        });
        onSuccess();
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour les informations du client.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du client.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Nom du client"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email || ""}
            onChange={handleChange}
            placeholder="email@exemple.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="06 12 34 56 78"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            placeholder="Adresse complète"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ficheType">Type de fiche</Label>
          <Select
            value={formData.ficheType || "RES010"}
            onValueChange={(value) => handleSelectChange("ficheType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RES010">RES010</SelectItem>
              <SelectItem value="RES020">RES020</SelectItem>
              <SelectItem value="RES030">RES030</SelectItem>
              <SelectItem value="RES040">RES040</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="climateZone">Zone climatique</Label>
          <Select
            value={formData.climateZone || "C"}
            onValueChange={(value) => handleSelectChange("climateZone", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Zone A</SelectItem>
              <SelectItem value="B">Zone B</SelectItem>
              <SelectItem value="C">Zone C</SelectItem>
              <SelectItem value="D">Zone D</SelectItem>
              <SelectItem value="E">Zone E</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="isolationType">Type d'isolation</Label>
          <Select
            value={formData.isolationType || "Combles"}
            onValueChange={(value) => handleSelectChange("isolationType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Combles">Combles</SelectItem>
              <SelectItem value="Murs">Murs</SelectItem>
              <SelectItem value="Plancher">Plancher</SelectItem>
              <SelectItem value="Toiture">Toiture</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="floorType">Type de plancher</Label>
          <Select
            value={formData.floorType || "Bois"}
            onValueChange={(value) => handleSelectChange("floorType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bois">Bois</SelectItem>
              <SelectItem value="Béton">Béton</SelectItem>
              <SelectItem value="Terre-plein">Terre-plein</SelectItem>
              <SelectItem value="Vide sanitaire">Vide sanitaire</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lotNumber">Numéro de lot</Label>
          <Input
            id="lotNumber"
            name="lotNumber"
            value={formData.lotNumber || ""}
            onChange={handleChange}
            placeholder="Numéro de lot"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="installationDate">Date d'installation</Label>
          <Input
            id="installationDate"
            name="installationDate"
            type="date"
            value={formData.installationDate || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
};
