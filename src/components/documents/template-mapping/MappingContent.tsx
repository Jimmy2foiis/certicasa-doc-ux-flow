
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { TemplateTag } from "./types";
import { AddNewTagField } from "./AddNewTagField";
import { TagsList } from "./TagsList";
import { VariableCategoryTabs } from "./VariableCategoryTabs";

interface MappingContentProps {
  loading: boolean;
  error: string | null;
  templateTags: TemplateTag[];
  clientData?: any;
  updateCategory: (index: number, category: string) => void;
  updateMapping: (index: number, value: string) => void;
  newTag: string;
  setNewTag: (tag: string) => void;
  handleAddTag: () => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export const MappingContent = ({
  loading,
  error,
  templateTags,
  clientData,
  updateCategory,
  updateMapping,
  newTag,
  setNewTag,
  handleAddTag,
  activeCategory,
  setActiveCategory
}: MappingContentProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 rounded-md p-4 text-red-800">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <AddNewTagField 
        newTag={newTag} 
        setNewTag={setNewTag} 
        handleAddTag={handleAddTag} 
      />
      
      <TagsList 
        tags={templateTags}
        clientData={clientData}
        updateCategory={updateCategory}
        updateMapping={updateMapping}
      />
      
      <VariableCategoryTabs 
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onSelectVariable={setNewTag}
      />
    </>
  );
};
