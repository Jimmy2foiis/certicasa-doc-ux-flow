import { Check } from 'lucide-react';

interface GenerationSuccessProps {
  clientId?: string;
  clientName?: string;
}

const GenerationSuccess = ({ clientId, clientName }: GenerationSuccessProps) => {
  return (
    <div className="py-6 flex flex-col items-center justify-center">
      <div className="bg-green-100 p-3 rounded-full mb-4">
        <Check className="h-6 w-6 text-green-600" />
      </div>
      <h3 className="font-medium text-lg mb-1">Document généré avec succès !</h3>
      <p className="text-center text-gray-500 mb-4">
        {clientId
          ? `Le document a été généré et ajouté au dossier de ${clientName}.`
          : 'Le document a été généré avec succès.'}
      </p>
    </div>
  );
};

export default GenerationSuccess;
