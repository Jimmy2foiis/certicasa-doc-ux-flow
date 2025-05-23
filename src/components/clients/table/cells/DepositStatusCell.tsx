
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getDepositVariant } from '../utils/statusUtils';

interface DepositStatusCellProps {
  status?: string;
}

const DepositStatusCell = ({ status }: DepositStatusCellProps) => {
  return (
    <Badge variant={getDepositVariant(status)} className="bg-opacity-20 font-normal">
      {status || 'Non déposé'}
    </Badge>
  );
};

export default DepositStatusCell;
