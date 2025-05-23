
import { ReactNode } from 'react';

interface SimpleColumnHeaderProps {
  title: string;
  className?: string;
}

const SimpleColumnHeader = ({ title, className = '' }: SimpleColumnHeaderProps) => {
  return (
    <span className={`text-xs font-semibold text-gray-700 ${className}`}>
      {title}
    </span>
  );
};

export default SimpleColumnHeader;
