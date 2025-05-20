
import { NifField } from "./NifField";
import { TypeField } from "./TypeField";
import { Control } from "react-hook-form";
import { ClientFormValues } from "../schemas/clientSchema";

interface ClientIdFieldsProps {
  control: Control<ClientFormValues>;
}

export const ClientIdFields = ({ control }: ClientIdFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <NifField control={control} />
      <TypeField control={control} />
    </div>
  );
};
