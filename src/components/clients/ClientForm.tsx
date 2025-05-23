
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Client } from "@/services/api/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Schéma de validation du formulaire client
const clientSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Format d'email invalide").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  nif: z.string().optional().or(z.literal("")),
  type: z.string().optional().or(z.literal("")),
  ficheType: z.string().optional().or(z.literal("")),
  climateZone: z.string().optional().or(z.literal("")),
  isolationType: z.string().optional().or(z.literal("")),
  floorType: z.string().optional().or(z.literal("")),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: Client) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ClientForm = ({ initialData, onSubmit, onCancel, isSubmitting }: ClientFormProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      nif: initialData?.nif || "",
      type: initialData?.type || "RES010",
      ficheType: initialData?.ficheType || "RES010",
      climateZone: initialData?.climateZone || "C",
      isolationType: initialData?.isolationType || "Combles",
      floorType: initialData?.floorType || "Bois",
    },
  });

  const handleSubmit = async (values: ClientFormValues) => {
    setIsSaving(true);
    try {
      // Construire l'objet client complet
      const clientData: Client = {
        ...values,
        id: initialData?.id, // Réutiliser l'ID existant si modification
        status: initialData?.status || "En cours",
        projects: initialData?.projects || 0,
      };
      
      await onSubmit(clientData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet*</FormLabel>
                <FormControl>
                  <Input placeholder="Nom complet" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="Téléphone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="nif"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIF</FormLabel>
                <FormControl>
                  <Input placeholder="NIF" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Adresse */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse complète</FormLabel>
              <FormControl>
                <Input placeholder="Adresse complète" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Informations techniques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="ficheType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de fiche</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="RES010">RES010</SelectItem>
                    <SelectItem value="RES020">RES020</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="climateZone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zone climatique</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une zone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isolationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type d'isolation</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Combles">Combles</SelectItem>
                    <SelectItem value="Rampants">Rampants</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Actions du formulaire */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSaving || isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isSaving || isSubmitting}
          >
            {isSaving || isSubmitting 
              ? "Enregistrement..." 
              : initialData?.id 
                ? "Mettre à jour" 
                : "Créer le client"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClientForm;
