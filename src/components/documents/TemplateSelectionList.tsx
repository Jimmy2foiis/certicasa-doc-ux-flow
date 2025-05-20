
import { useState, useEffect } from "react";
import { FileText, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useDocumentTemplates } from "@/hooks/useDocumentTemplates";

interface TemplateSelectionListProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

const TemplateSelectionList = ({ 
  selectedTemplate,
  onTemplateSelect
}: TemplateSelectionListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { templates, loading, refreshTemplates } = useDocumentTemplates();
  const [filteredTemplates, setFilteredTemplates] = useState(templates);
  const { toast } = useToast();

  // Filter templates based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = templates.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        template.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTemplates(filtered);
    } else {
      setFilteredTemplates(templates);
    }
  }, [searchTerm, templates]);

  // Manuellement rafraîchir les templates
  const handleRefreshTemplates = () => {
    refreshTemplates();
    toast({
      title: "Actualisation",
      description: "Liste des modèles actualisée."
    });
  };

  return (
    <div className="pb-2">
      <div className="flex items-center space-x-2 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un modèle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleRefreshTemplates}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="h-72 rounded-md border">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Chargement des modèles...</p>
          </div>
        ) : filteredTemplates.length > 0 ? (
          <RadioGroup value={selectedTemplate} onValueChange={onTemplateSelect} className="p-1">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                  selectedTemplate === template.id ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <RadioGroupItem value={template.id} id={`template-${template.id}`} />
                <Label
                  htmlFor={`template-${template.id}`}
                  className="flex flex-1 items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center">
                    <FileText className={`h-5 w-5 mr-3 ${template.type === 'docx' ? 'text-blue-500' : 'text-red-500'}`} />
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-xs text-gray-500">Ajouté le {template.dateUploaded}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="uppercase"
                  >
                    {template.type}
                  </Badge>
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <p className="text-gray-500 mb-2">
              {searchTerm 
                ? "Aucun modèle ne correspond à votre recherche."
                : "Aucun modèle n'est disponible. Veuillez téléverser des modèles dans la bibliothèque."
              }
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSearchTerm("")}
              >
                Effacer la recherche
              </Button>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default TemplateSelectionList;
