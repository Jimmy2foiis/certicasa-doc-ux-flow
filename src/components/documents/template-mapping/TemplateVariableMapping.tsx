
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TagsList } from "./TagsList";
import { AddNewTagField } from "./AddNewTagField";
import { VariableCategoryTabs } from "./VariableCategoryTabs";
import { DocumentTemplate, TemplateTag } from "@/types/documents";
import { MappingContentProps, TemplateVariableMappingProps } from "./types";

export const TemplateVariableMapping = ({ 
  template,
  clientData,
  onMappingComplete 
}: TemplateVariableMappingProps) => {
  const [loading, setLoading] = useState(false);
  const [templateTags, setTemplateTags] = useState<TemplateTag[]>([]);
  const [newTag, setNewTag] = useState("");
  const [activeCategory, setActiveCategory] = useState("client");

  // Extract variables from template content
  useEffect(() => {
    if (template && template.content) {
      setLoading(true);
      setTimeout(() => {
        const extractedTags = extractTagsFromContent(template.content || "");
        setTemplateTags(extractedTags);
        setLoading(false);
      }, 500); // Simulate loading
    }
  }, [template]);

  // Extract template tags from content
  const extractTagsFromContent = (content: string): TemplateTag[] => {
    // Regular expression to match {{tag}} pattern
    const tagRegex = /\{\{([^}]+)\}\}/g;
    const tags: TemplateTag[] = [];
    const foundTags = new Set<string>();
    
    let match;
    while ((match = tagRegex.exec(content)) !== null) {
      const tagName = match[1].trim();
      
      // Skip duplicate tags
      if (foundTags.has(tagName)) continue;
      foundTags.add(tagName);
      
      // Create a new tag with default category
      tags.push({
        tag: tagName,
        category: "client",
        mappedTo: ""
      });
    }
    
    return tags;
  };

  // Add a new tag manually
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    // Check if tag already exists
    if (templateTags.some(t => t.tag === newTag.trim())) {
      setNewTag("");
      return;
    }
    
    setTemplateTags([
      ...templateTags,
      {
        tag: newTag.trim(),
        category: activeCategory,
        mappedTo: ""
      }
    ]);
    
    setNewTag("");
  };

  // Update the mapping value for a tag
  const updateMapping = (index: number, value: string) => {
    const updatedTags = [...templateTags];
    updatedTags[index] = { ...updatedTags[index], mappedTo: value };
    setTemplateTags(updatedTags);
    
    // Call the parent callback
    onMappingComplete(updatedTags);
  };

  // Update the category for a tag
  const updateCategory = (index: number, category: string) => {
    const updatedTags = [...templateTags];
    updatedTags[index] = { ...updatedTags[index], category };
    setTemplateTags(updatedTags);
    
    // Call the parent callback
    onMappingComplete(updatedTags);
  };

  // Shared props for mapping components
  const mappingContentProps: MappingContentProps = {
    loading,
    templateTags,
    newTag,
    setNewTag,
    handleAddTag,
    activeCategory,
    setActiveCategory,
    updateMapping,
    updateCategory,
    clientData
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          Mapping des variables du modèle
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            <AddNewTagField {...mappingContentProps} />
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <VariableCategoryTabs {...mappingContentProps} />
              </div>
              
              <div className="w-full md:w-2/3">
                <TagsList {...mappingContentProps} />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TemplateVariableMapping;
