
import React from 'react';

interface LotNumberCellProps {
  lotNumber?: string | null;
}

const LotNumberCell = ({ lotNumber }: LotNumberCellProps) => {
  return lotNumber ? (
    <span className="text-blue-600 hover:underline cursor-pointer">
      {lotNumber}
    </span>
  ) : (
    <span className="text-gray-400 text-sm">Non assigné</span>
  );
};

export default LotNumberCell;
