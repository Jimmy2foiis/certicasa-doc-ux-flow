
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ClimateZoneCellProps {
  zone?: string;
}

const ClimateZoneCell = ({ zone }: ClimateZoneCellProps) => {
  return (
    <Badge variant="outline" className="py-0 px-2 text-xs bg-gray-50">
      {zone || 'C'}
    </Badge>
  );
};

export default ClimateZoneCell;
