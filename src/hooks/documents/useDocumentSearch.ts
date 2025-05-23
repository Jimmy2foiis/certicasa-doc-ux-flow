import { useState, useEffect } from "react";
import type { AdministrativeDocument } from "@/types/documents";

export function useDocumentSearch(documents: AdministrativeDocument[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState<AdministrativeDocument[]>(documents);

  // Filter documents based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDocuments(documents);
      return;
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = documents.filter(doc => 
      doc.name.toLowerCase().includes(lowerCaseQuery) ||
      (doc.category && doc.category.toLowerCase().includes(lowerCaseQuery)) ||
      doc.type.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredDocuments(filtered);
  }, [searchQuery, documents]);

  return { searchQuery, setSearchQuery, filteredDocuments };
}
