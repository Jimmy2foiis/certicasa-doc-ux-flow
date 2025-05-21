
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, UserCheck, Clipboard, Calendar, User } from "lucide-react";

const CommercialSpace = () => {
  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Espace Commercial / Terrain</h1>

      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList className="mb-6 bg-white p-1 shadow-sm rounded-md">
          <TabsTrigger value="pipeline" className="flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            <span>Pipeline Commercial</span>
          </TabsTrigger>
          <TabsTrigger value="qualification" className="flex items-center gap-1">
            <UserCheck className="h-4 w-4" />
            <span>Qualification</span>
          </TabsTrigger>
          <TabsTrigger value="visits" className="flex items-center gap-1">
            <Clipboard className="h-4 w-4" />
            <span>Visites Techniques</span>
          </TabsTrigger>
          <TabsTrigger value="planning" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Planning</span>
          </TabsTrigger>
          <TabsTrigger value="crm" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Clients</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline">
          <div className="p-6 bg-white rounded-md shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Pipeline Commercial</h2>
            <p className="text-gray-600">
              Cette section permettra de visualiser et gérer le pipeline commercial des leads.
              Vous pourrez voir l'ensemble de vos opportunités et leur progression dans votre
              processus de vente.
            </p>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-blue-700 text-sm">
                Fonctionnalité en cours de développement. Disponible prochainement.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="qualification">
          <div className="p-6 bg-white rounded-md shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Qualification des Prospects</h2>
            <p className="text-gray-600">
              Cet espace permettra de qualifier vos prospects et de suivre les interactions
              commerciales (appels, emails, rendez-vous).
            </p>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-blue-700 text-sm">
                Fonctionnalité en cours de développement. Disponible prochainement.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="visits">
          <div className="p-6 bg-white rounded-md shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Visites Techniques</h2>
            <p className="text-gray-600">
              Planifiez et gérez les visites techniques chez vos clients. 
              Enregistrez les informations et synchronisez-les avec le dossier administratif.
            </p>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-blue-700 text-sm">
                Fonctionnalité en cours de développement. Disponible prochainement.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="planning">
          <div className="p-6 bg-white rounded-md shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Planning des Interventions</h2>
            <p className="text-gray-600">
              Visualisez et gérez le planning des interventions pour vos équipes de pose.
              Assignez les équipes, suivez l'avancement et gérez les changements de planning.
            </p>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-blue-700 text-sm">
                Fonctionnalité en cours de développement. Disponible prochainement.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="crm">
          <div className="p-6 bg-white rounded-md shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Gestion des Clients (CRM)</h2>
            <p className="text-gray-600">
              Consultez et gérez la base clients de manière simplifiée, avec un focus
              sur les aspects commerciaux et de suivi.
            </p>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-blue-700 text-sm">
                Fonctionnalité en cours de développement. Disponible prochainement.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommercialSpace;
