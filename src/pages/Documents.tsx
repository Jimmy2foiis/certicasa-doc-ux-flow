
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import DocumentGeneration from "@/components/documents/DocumentGeneration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

const Documents = () => {
  const [activeTab, setActiveTab] = useState("library");
  const [searchQuery, setSearchQuery] = useState("");

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
                <CardContent className="pt-6">
                  <div className="text-center p-8">
                    <h2 className="text-lg font-medium mb-2">Bibliothèque de Documents</h2>
                    <p className="text-gray-500 mb-4">
                      Tous vos documents générés apparaîtront ici.
                    </p>
                    <Button onClick={() => setActiveTab("generate")}>
                      Générer un nouveau document
                    </Button>
                  </div>
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
