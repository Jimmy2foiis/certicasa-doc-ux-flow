
import React, { useState, useEffect } from "react";
import { TemplateTag } from "@/types/documents";
import { TagsList } from "./TagsList";
import { VariableCategoryTabs } from "./VariableCategoryTabs";
import { AddNewTagField } from "./AddNewTagField";
import { createInitialMapping, extractTemplateTags } from "./utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface TemplateVariableMappingProps {
  template: any;
  clientData: any;
  onMappingComplete?: (mappings: TemplateTag[]) => void;
}

export const TemplateVariableMapping = ({
  template,
  clientData,
  onMappingComplete,
}: TemplateVariableMappingProps) => {
  const [mappings, setMappings] = useState<TemplateTag[]>([]);
  const [isPDFWithFormFields, setIsPDFWithFormFields] = useState<boolean>(false);
  
  // Fonction pour extraire les balises et créer les mappings initiaux
  useEffect(() => {
    if (!template) return;

    let extractedTags: string[] = [];
    const defaultMappings: TemplateTag[] = [];
    
    // Détection des tags selon le type de document
    if (template.type === 'pdf') {
      // Pour les PDF, on vérifie d'abord s'il s'agit d'un AcroForm
      // Cette détection est approximative car nous n'avons pas un moyen direct de vérifier
      const hasPotentialFormFields = 
        template.content?.includes('AcroForm') || 
        template.content?.includes('/T(') ||
        template.extracted_text?.includes('Form Field:');
      
      setIsPDFWithFormFields(hasPotentialFormFields);
      
      // Tenter d'extraire des balises du texte
      if (template.extracted_text) {
        extractedTags = extractTemplateTags(template.extracted_text, template.type);
      }
    } else if (template.type === 'docx') {
      // Pour les DOCX, extraire les tags avec Docxtemplater directement du contenu
      extractedTags = extractTemplateTags(template.content, template.type);
    } else if (template.content) {
      // Pour les autres types, tenter sur le contenu
      extractedTags = extractTemplateTags(template.content, template.type);
    }
    
    // Créer les mappings par défaut pour les tags trouvés
    extractedTags.forEach(tag => {
      // Nettoyer le tag des caractères de formatage
      const cleanTag = tag.replace(/[{}]/g, '').trim();
      
      // Créer une suggestion de mapping par défaut
      let category = "client"; // par défaut
      let field = cleanTag;
      
      // Détecter la catégorie probable
      if (cleanTag.includes('.')) {
        const [probableCategory, probableField] = cleanTag.split('.');
        category = probableCategory;
        field = probableField;
      } else {
        // Essayer de deviner la catégorie
        if (['surface', 'type_projet', 'date_debut', 'description'].includes(cleanTag)) {
          category = 'project';
        } else if (['ref', 'reference', 'parcelle', 'coordonnees'].includes(cleanTag)) {
          category = 'cadastre';
        } else if (['economie', 'montant', 'resultat', 'estimation'].includes(cleanTag)) {
          category = 'calcul';
        }
      }
      
      defaultMappings.push({
        tag,
        category,
        mappedTo: `${category}.${field}`
      });
    });
    
    setMappings(defaultMappings);
    
    // Notifier le parent des mappings initiaux
    if (onMappingComplete) {
      onMappingComplete(defaultMappings);
    }
  }, [template, onMappingComplete]);

  // Gérer les modifications de mapping
  const handleMappingChange = (updatedMappings: TemplateTag[]) => {
    setMappings(updatedMappings);
    
    if (onMappingComplete) {
      onMappingComplete(updatedMappings);
    }
  };

  // Ajouter un nouveau tag
  const handleAddTag = (newTag: string, category: string) => {
    if (!newTag || newTag.trim() === '') return;
    
    // Formater le tag si nécessaire
    const formattedTag = newTag.includes('{{') ? newTag : `{{${newTag}}}`;
    const newMapping = {
      tag: formattedTag,
      category,
      mappedTo: `${category}.${newTag.replace(/[{}]/g, '')}`
    };
    
    const updatedMappings = [...mappings, newMapping];
    setMappings(updatedMappings);
    
    if (onMappingComplete) {
      onMappingComplete(updatedMappings);
    }
  };

  return (
    <div className="space-y-4">
      {template?.type === 'pdf' && isPDFWithFormFields && (
        <Alert className="bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertTitle>PDF avec champs de formulaire</AlertTitle>
          <AlertDescription>
            Ce modèle PDF contient des champs de formulaire. Les variables seront remplies dans ces champs.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Mapping des variables</CardTitle>
          <CardDescription>
            Configurez la correspondance entre les balises du modèle et les données client
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AddNewTagField onAddTag={handleAddTag} />
          
          <TagsList 
            mappings={mappings} 
            onMappingsChange={handleMappingChange} 
          />
          
          <VariableCategoryTabs 
            clientData={clientData}
            onVariableSelect={(variable) => {
              const [category, field] = variable.split('.');
              handleAddTag(field, category);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateVariableMapping;
