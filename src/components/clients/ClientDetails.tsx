
import { useState } from "react";
import ClientDetailsView from "./ClientDetailsView";

interface ClientDetailsProps {
  clientId: string;
  onBack: () => void;
}

const ClientDetails = ({ clientId, onBack }: ClientDetailsProps) => {
  return <ClientDetailsView clientId={clientId} onBack={onBack} />;
};

export default ClientDetails;
