
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import DocumentGeneration from "@/components/documents/DocumentGeneration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, FileText } from "lucide-react";
import { useDocumentTemplates } from "@/hooks/useDocumentTemplates";

const Documents = () => {
  const [activeTab, setActiveTab] = useState("library");
  const [searchQuery, setSearchQuery] = useState("");
  const { templates, loading } = useDocumentTemplates();
  
  // Filtrer les templates selon la recherche
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    template.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Documents</h1>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un document..."
                  className="pl-9 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="library">Bibliothèque</TabsTrigger>
              <TabsTrigger value="templates">Modèles</TabsTrigger>
              <TabsTrigger value="generate">Génération</TabsTrigger>
            </TabsList>
            
            <TabsContent value="library">
              <Card>
                <CardHeader>
                  <CardTitle>Bibliothèque de Documents</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {loading ? (
                    <div className="text-center py-8">Chargement des modèles...</div>
                  ) : templates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredTemplates.map(template => (
                        <Card key={template.id} className="overflow-hidden">
                          <CardContent className="p-4 flex items-start space-x-4">
                            <div className={`p-3 rounded-full ${template.type === 'docx' ? 'bg-blue-100' : 'bg-red-100'}`}>
                              <FileText className={`h-6 w-6 ${template.type === 'docx' ? 'text-blue-600' : 'text-red-600'}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{template.name}</h3>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-500">Ajouté le {template.dateUploaded}</span>
                                <span className="text-xs uppercase px-2 py-1 rounded-full bg-gray-100 text-gray-700">{template.type}</span>
                              </div>
                            </div>
                          </CardContent>
                          <div className="border-t px-4 py-3 flex justify-end gap-2">
                            <Button variant="outline" size="sm">Aperçu</Button>
                            <Button size="sm">Utiliser</Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <h2 className="text-lg font-medium mb-2">Aucun modèle disponible</h2>
                      <p className="text-gray-500 mb-4">
                        Ajoutez des modèles pour pouvoir générer des documents.
                      </p>
                      <Button onClick={() => setActiveTab("templates")}>
                        Ajouter un modèle
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="templates">
              <DocumentGeneration />
            </TabsContent>
            
            <TabsContent value="generate">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center p-8">
                    <h2 className="text-lg font-medium mb-2">Générer des Documents</h2>
                    <p className="text-gray-500 mb-4">
                      Utilisez cette section pour générer de nouveaux documents à partir des modèles disponibles.
                    </p>
                    <Button onClick={() => setActiveTab("templates")}>
                      Ajouter de nouveaux modèles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Documents;
