
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Client } from "@/types/clientTypes";
import { useForm } from "react-hook-form";

export interface ClientFormProps {
  client?: Client | null;
  onClientUpdated?: () => void;
  onClose?: () => void;
  onSubmit?: (data: Client) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({
  client,
  onClientUpdated,
  onClose,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const { toast } = useToast();
  const defaultValues = {
    id: client?.id || "",
    name: client?.name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    address: client?.address || "",
    nif: client?.nif || "",
    type: client?.type || "Particulier",
    status: client?.status || "Nouveau"
  };

  const { register, handleSubmit, formState: { errors } } = useForm<Client>({
    defaultValues
  });

  const handleFormSubmit = async (formData: Client) => {
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default functionality if onSubmit not provided
        toast({
          title: "Client sauvegardé",
          description: "Le client a été sauvegardé avec succès",
        });
        
        if (onClientUpdated) {
          onClientUpdated();
        }
        
        if (onClose) {
          onClose();
        }
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du client:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le client",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Nom</label>
          <Input
            id="name"
            {...register("name", { required: "Le nom est requis" })}
            placeholder="Nom du client"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="Email"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">Téléphone</label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="Téléphone"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium">Type</label>
          <Select defaultValue={client?.type || "Particulier"}>
            <SelectTrigger>
              <SelectValue placeholder="Type de client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Particulier">Particulier</SelectItem>
              <SelectItem value="Entreprise">Entreprise</SelectItem>
              <SelectItem value="Administration">Administration</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">Statut</label>
          <Select defaultValue={client?.status || "Nouveau"}>
            <SelectTrigger>
              <SelectValue placeholder="Statut du client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nouveau">Nouveau</SelectItem>
              <SelectItem value="En cours">En cours</SelectItem>
              <SelectItem value="Terminé">Terminé</SelectItem>
              <SelectItem value="Actif">Actif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel || onClose}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sauvegarde..." : client ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;
