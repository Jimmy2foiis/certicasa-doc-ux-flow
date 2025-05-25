
interface CalculationsDisplayProps {
  annualSavings: number;
  projectPrice: number;
  pricePerSqm: number;
}

const CalculationsDisplay = ({ annualSavings, projectPrice, pricePerSqm }: CalculationsDisplayProps) => {
  return (
    <div className="space-y-2 bg-gray-50 p-4 rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-sm text-gray-500">CAE projet</div>
          <div className="font-medium">{annualSavings.toFixed(2)} kWh/an</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm text-gray-500">Prix projet</div>
          <div className="font-medium">{projectPrice.toFixed(2)} €</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm text-gray-500">Prix au m²</div>
          <div className="font-medium">{pricePerSqm.toFixed(2)} €/m²</div>
        </div>
      </div>
    </div>
  );
};

export default CalculationsDisplay;
