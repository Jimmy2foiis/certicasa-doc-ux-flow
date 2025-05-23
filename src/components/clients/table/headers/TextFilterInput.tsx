
import { Input } from '@/components/ui/input';

interface TextFilterInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TextFilterInput = ({ placeholder, value, onChange, className = '' }: TextFilterInputProps) => {
  return (
    <Input 
      placeholder={placeholder}
      className={`h-7 text-xs ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default TextFilterInput;
