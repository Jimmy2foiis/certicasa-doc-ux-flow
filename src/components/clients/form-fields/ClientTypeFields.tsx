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
                value={field.value || initialData?.climateZone || "C3"}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A3">A3 (Coeff: 25)</SelectItem>
                  <SelectItem value="A4">A4 (Coeff: 26)</SelectItem>
                  <SelectItem value="B3">B3 (Coeff: 32)</SelectItem>
                  <SelectItem value="B4">B4 (Coeff: 33)</SelectItem>
                  <SelectItem value="C1">C1 (Coeff: 44)</SelectItem>
                  <SelectItem value="C2">C2 (Coeff: 45)</SelectItem>
                  <SelectItem value="C3">C3 (Coeff: 46)</SelectItem>
                  <SelectItem value="C4">C4 (Coeff: 46)</SelectItem>
                  <SelectItem value="D1">D1 (Coeff: 60)</SelectItem>
                  <SelectItem value="D2">D2 (Coeff: 60)</SelectItem>
                  <SelectItem value="D3">D3 (Coeff: 61)</SelectItem>
                  <SelectItem value="E1">E1 (Coeff: 74)</SelectItem>
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
