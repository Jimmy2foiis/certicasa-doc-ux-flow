
import React from 'react';
import { getFloorTypeIcon } from '../utils/statusUtils';

interface FloorTypeCellProps {
  type?: string;
}

const FloorTypeCell = ({ type }: FloorTypeCellProps) => {
  return (
    <span className="flex items-center">
      <span className="mr-1">{getFloorTypeIcon(type)}</span>
      <span className="text-sm text-gray-600">{type || 'Bois'}</span>
    </span>
  );
};

export default FloorTypeCell;
