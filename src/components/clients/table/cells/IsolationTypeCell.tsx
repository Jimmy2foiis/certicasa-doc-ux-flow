
import React from 'react';
import { getIsolationTypeIcon } from '../utils/statusUtils';

interface IsolationTypeCellProps {
  type?: string;
}

const IsolationTypeCell = ({ type }: IsolationTypeCellProps) => {
  return (
    <span className="flex items-center">
      <span className="mr-1">{getIsolationTypeIcon(type)}</span>
      <span className="text-sm text-gray-600">{type || 'Combles'}</span>
    </span>
  );
};

export default IsolationTypeCell;
