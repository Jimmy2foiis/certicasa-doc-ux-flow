
import { Mail, Phone, Building, FileText, Calendar } from "lucide-react";

interface ClientBasicInfoProps {
  email: string;
  phone: string;
  nif: string;
  type: string;
}

const ClientBasicInfo = ({ email, phone, nif, type }: ClientBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="flex">
        <Mail className="h-5 w-5 text-gray-500 mr-3" />
        <span>{email}</span>
      </div>
      <div className="flex">
        <Phone className="h-5 w-5 text-gray-500 mr-3" />
        <span>{phone}</span>
      </div>
      <div className="flex">
        <Building className="h-5 w-5 text-gray-500 mr-3" />
        <span>NIF: {nif || "X-1234567-Z"}</span>
      </div>
      <div className="flex">
        <FileText className="h-5 w-5 text-gray-500 mr-3" />
        <span>Type: RES{type || "010"}</span>
      </div>
      <div className="flex">
        <Calendar className="h-5 w-5 text-gray-500 mr-3" />
        <span>Inscription: 14/04/2023</span>
      </div>
    </div>
  );
};

export default ClientBasicInfo;
