
import React from 'react';
import { getStatusDot } from '../utils/statusUtils';

interface StatusCellProps {
  status?: string;
}

const StatusCell = ({ status }: StatusCellProps) => {
  return (
    <div className="flex items-center">
      {getStatusDot(status)}
      <span className="text-sm">{status || 'En cours'}</span>
    </div>
  );
};

export default StatusCell;
