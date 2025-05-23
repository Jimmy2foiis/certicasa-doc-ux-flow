
import { ReactNode } from 'react';

interface FilteredColumnHeaderProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const FilteredColumnHeader = ({ title, children, className = '' }: FilteredColumnHeaderProps) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-xs font-semibold text-gray-700">{title}</span>
      <div>
        {children}
      </div>
    </div>
  );
};

export default FilteredColumnHeader;
