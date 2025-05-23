import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tag } from 'lucide-react';

interface AddNewTagFieldProps {
  newTag: string;
  setNewTag: (tag: string) => void;
  handleAddTag: () => void;
}

export const AddNewTagField = ({ newTag, setNewTag, handleAddTag }: AddNewTagFieldProps) => {
  return (
    <div className="space-y-2">
      <Label>Ajouter une nouvelle balise</Label>
      <div className="flex gap-2">
        <Input
          placeholder="Exemple: nom, prénom, adresse..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
        <Button onClick={handleAddTag}>
          <Tag className="mr-2 h-4 w-4" /> Ajouter
        </Button>
      </div>
      <p className="text-sm text-gray-500">Les balises seront formatées comme {`{{balise}}`}</p>
    </div>
  );
};
