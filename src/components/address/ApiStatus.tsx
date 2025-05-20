
interface ApiStatusProps {
  isLoading: boolean;
  apiAvailable: boolean;
}

export const ApiStatus = ({ isLoading, apiAvailable }: ApiStatusProps) => {
  if (isLoading) {
    return <p className="text-xs text-gray-500">Chargement de la recherche d'adresse...</p>;
  }
  
  if (!apiAvailable) {
    return (
      <p className="text-xs text-amber-600">
        L'autocomplétion des adresses n'est pas disponible. Vous pouvez saisir manuellement l'adresse.
      </p>
    );
  }
  
  return null;
};
