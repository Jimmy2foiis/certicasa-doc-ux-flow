
import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export const ClientActions = () => {
  return (
    <div className="pt-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-2 py-3">
            Action
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56">
          <DropdownMenuItem>Modifier les informations</DropdownMenuItem>
          <DropdownMenuItem>Programmer une visite</DropdownMenuItem>
          <DropdownMenuItem>Générer un devis</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Supprimer le client</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
