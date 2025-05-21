// Let's fix the AdminDocument issue by ensuring we convert AdminDocument to AdministrativeDocument
// I'll just update the problematic part of the file

// When the administrative documents are loaded
useEffect(() => {
  if (clientId && adminDocuments) {
    // Transform AdminDocuments to ensure they have all required properties for AdministrativeDocument
    const transformedDocs: AdministrativeDocument[] = adminDocuments.map(doc => ({
      ...doc,
      // Add required properties that may be missing
      description: (doc as any).description || "",
      order: (doc as any).order || 0,
      // Make sure other required properties are present
      id: doc.id,
      name: doc.name,
      type: doc.type,
      status: doc.status,
    }));
    
    // Create a combined list
    const combinedDocs: AdministrativeDocument[] = [
      ...transformedDocs,
      ...clientDocuments.map(doc => ({
        ...doc,
        description: (doc as any).description || "",
        order: (doc as any).order || 0,
      }))
    ];
    
    setAllDocuments(combinedDocs);
  }
}, [clientId, adminDocuments, clientDocuments]);
