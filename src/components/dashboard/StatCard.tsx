
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatDetail {
  label: string;
  value: string;
}

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: React.ReactNode;
  details: StatDetail[];
  trend: number;
  className?: string;
}

const StatCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  details, 
  trend, 
  className 
}: StatCardProps) => {
  const isPositiveTrend = trend >= 0;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline mt-1">
              <h3 className="text-2xl font-bold">{value}</h3>
              {unit && <span className="ml-1 text-muted-foreground">{unit}</span>}
            </div>
          </div>
          <div className="p-2 bg-gray-100 rounded-md">
            {icon}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          {details.map((detail, index) => (
            <div key={index} className="text-sm">
              <p className="text-muted-foreground">{detail.label}</p>
              <p className="font-medium">{detail.value}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center text-sm">
          <div className={cn(
            "flex items-center px-1.5 py-0.5 rounded",
            isPositiveTrend ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
          )}>
            {isPositiveTrend ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
          <span className="text-muted-foreground ml-1.5">desde el mes anterior</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
