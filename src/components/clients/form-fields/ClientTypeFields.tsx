
import React from "react";
import { Control } from "react-hook-form";
import { ClientFormValues } from "../schemas/clientSchema";
import { Client } from "@/services/api/types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ClientTypeFieldsProps {
  control: Control<ClientFormValues>;
  initialData?: Client;
}

export const ClientTypeFields = ({ control, initialData }: ClientTypeFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="ficheType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de fiche</FormLabel>
            <FormControl>
              <Select
                value={field.value || initialData?.ficheType || "RES010"}
                onValueChange={field.onChange}
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
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="climateZone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Zone climatique</FormLabel>
            <FormControl>
              <Select
                value={field.value || initialData?.climateZone || "C"}
                onValueChange={field.onChange}
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
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="isolationType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type d'isolation</FormLabel>
            <FormControl>
              <Select
                value={field.value || initialData?.isolationType || "Combles"}
                onValueChange={field.onChange}
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
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="floorType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de plancher</FormLabel>
            <FormControl>
              <Select
                value={field.value || initialData?.floorType || "Bois"}
                onValueChange={field.onChange}
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
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="lotNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro de lot</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Numéro de lot" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="installationDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date d'installation</FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
