
import React from 'react';

interface CommunityCellProps {
  community?: string;
}

const CommunityCell = ({ community }: CommunityCellProps) => {
  return (
    <span className="text-sm text-gray-700">
      {community || 'Non définie'}
    </span>
  );
};

export default CommunityCell;
