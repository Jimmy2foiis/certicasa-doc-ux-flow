
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getFicheTypeVariant } from '../utils/statusUtils';

interface FicheTypeCellProps {
  type?: string;
}

const FicheTypeCell = ({ type }: FicheTypeCellProps) => {
  return (
    <Badge variant={getFicheTypeVariant(type)} className="font-normal bg-opacity-20">
      {type || 'RES010'}
    </Badge>
  );
};

export default FicheTypeCell;
