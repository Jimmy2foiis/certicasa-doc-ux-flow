
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBCoefficientTableData, bCoefficientTable, VentilationType } from "@/utils/calculationUtils";

interface BCoefficientTableProps {
  isAfterWork: boolean;
  ventilationType: VentilationType;
  ratioValue: number;
}

const BCoefficientTable = ({ isAfterWork, ventilationType, ratioValue }: BCoefficientTableProps) => {
  const bCoefficientTableData = getBCoefficientTableData();

  return (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ratio Combles/Toiture</TableHead>
            <TableHead>
              Coefficient B {isAfterWork ? "(après)" : "(avant)"} - {ventilationType === "caso1" ? "Légèrement ventilé" : "Très ventilé"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bCoefficientTableData.map((item, index) => (
            <TableRow 
              key={index} 
              className={
                (ratioValue >= bCoefficientTable[index].min && (bCoefficientTable[index].max === null || ratioValue < bCoefficientTable[index].max)) 
                ? "bg-green-50" 
                : ""
              }
            >
              <TableCell>{item.range}</TableCell>
              <TableCell>{isAfterWork 
                ? (ventilationType === "caso1" ? item.caso1AfterWork : item.caso2AfterWork)
                : (ventilationType === "caso1" ? item.caso1 : item.caso2)
              }</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BCoefficientTable;
