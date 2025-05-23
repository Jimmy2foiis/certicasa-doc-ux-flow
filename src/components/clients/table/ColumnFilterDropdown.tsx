
import { useState } from 'react';
import { Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ColumnFilterDropdownProps {
  title: string;
  options: string[];
  filterKey: string;
  value: string;
  onChange: (key: string, value: string) => void;
}

const ColumnFilterDropdown = ({
  title,
  options,
  filterKey,
  value,
  onChange,
}: ColumnFilterDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild className="data-[state=open]:bg-gray-100">
      <Button variant="ghost" size="sm" className="h-7 px-2 flex gap-1 items-center">
        <Filter className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-sm">{value || title}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="bg-white shadow-lg border rounded-md w-52 z-50">
      <div className="p-2">
        <Input
          placeholder="Filtrer..."
          className="h-8 text-xs"
          value={value}
          onChange={(e) => onChange(filterKey, e.target.value)}
        />
      </div>
      <DropdownMenuSeparator />
      {options.map(option => (
        <DropdownMenuItem
          key={option}
          onClick={() => onChange(filterKey, option)}
          className="cursor-pointer text-sm flex items-center justify-between"
        >
          {option}
          {value === option && (
            <span className="ml-2 h-4 w-4 text-green-600">•</span>
          )}
        </DropdownMenuItem>
      ))}
      {value && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => onChange(filterKey, '')}
            className="cursor-pointer text-sm text-red-600"
          >
            Effacer le filtre
          </DropdownMenuItem>
        </>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default ColumnFilterDropdown;
