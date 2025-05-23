
import { useState, useMemo } from 'react';
import { AdministrativeDocument } from '@/types/documents';

export const useDocumentSearch = (documents: AdministrativeDocument[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           doc.description.toLowerCase().includes(searchQuery.toLowerCase());
                           
      const matchesCategory = !filterCategory || (doc.category && doc.category === filterCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [documents, searchQuery, filterCategory]);
  
  // Get unique categories from documents
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    
    documents.forEach(doc => {
      if (doc.category) {
        uniqueCategories.add(doc.category);
      }
    });
    
    return Array.from(uniqueCategories);
  }, [documents]);
  
  return {
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filteredDocuments,
    categories
  };
};

export default useDocumentSearch;
