
import * as z from "zod";

// Define validation schema
export const clientSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez entrer un email valide" }).optional().or(z.literal('')),
  phone: z.string()
    .regex(/^[0-9+\s()-]{6,20}$/, { message: "Format de téléphone invalide" })
    .optional()
    .or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  nif: z.string()
    .regex(/^[0-9A-Z]{9}$/, { message: "Le NIF doit contenir 9 caractères alphanumériques" })
    .optional()
    .or(z.literal('')),
  type: z.string().optional().or(z.literal('')),
  ficheType: z.string().optional().or(z.literal('')),
  climateZone: z.string().optional().or(z.literal('')),
  isolationType: z.string().optional().or(z.literal('')),
  floorType: z.string().optional().or(z.literal('')),
  lotNumber: z.string().optional().or(z.literal('')),
  installationDate: z.string().optional().or(z.literal(''))
});

export type ClientFormValues = z.infer<typeof clientSchema>;
