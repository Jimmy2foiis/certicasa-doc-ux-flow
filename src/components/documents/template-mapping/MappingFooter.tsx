
import { Button } from "@/components/ui/button";
import { TemplateTag } from "@/types/documents";

interface MappingFooterProps {
  templateTags: TemplateTag[];
  handleSaveMapping: () => void;
}

export const MappingFooter = ({ templateTags, handleSaveMapping }: MappingFooterProps) => {
  return (
    <div className="mt-6 flex justify-between items-center">
      <div className="text-sm text-muted-foreground">
        {templateTags.length === 0 ? (
          <span>Aucune variable n'a été définie</span>
        ) : (
          <span>
            {templateTags.filter(t => t.mappedTo).length}/{templateTags.length} variables associées
          </span>
        )}
      </div>
      
      <Button 
        variant="default"
        onClick={handleSaveMapping}
        disabled={templateTags.length === 0}
      >
        Confirmer l'association
      </Button>
    </div>
  );
};
