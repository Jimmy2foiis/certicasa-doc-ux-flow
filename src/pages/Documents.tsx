import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import DocumentGeneration from '@/features/documents/DocumentGeneration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { useDocumentTemplates } from '@/hooks/useDocumentTemplates';
import LibraryTabContent from '@/features/documents/LibraryTabContent';
import GenerateTabContent from '@/features/documents/GenerateTabContent';

const Documents = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [searchQuery, setSearchQuery] = useState('');
  const { templates, loading, refreshTemplates } = useDocumentTemplates();

  // Fonction pour changer l'onglet, partagée globalement
  const changeToLibraryTab = useCallback(() => {
    setActiveTab('library');
  }, []);

  // Mettre à disposition la fonction pour changer d'onglet
  useEffect(() => {
    (window as any).changeToLibraryTab = changeToLibraryTab;

    return () => {
      delete (window as any).changeToLibraryTab;
    };
  }, [changeToLibraryTab]);

  // Rafraîchir les templates lorsque l'onglet "library" est activé
  useEffect(() => {
    if (activeTab === 'library') {
      refreshTemplates();
    }
  }, [activeTab, refreshTemplates]);

  // Filtrer les templates selon la recherche
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.type.toLowerCase().includes(searchQuery.toLowerCase()),
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
              <LibraryTabContent
                loading={loading}
                filteredTemplates={filteredTemplates}
                setActiveTab={setActiveTab}
              />
            </TabsContent>

            <TabsContent value="templates">
              <DocumentGeneration />
            </TabsContent>

            <TabsContent value="generate">
              <GenerateTabContent setActiveTab={setActiveTab} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Documents;
