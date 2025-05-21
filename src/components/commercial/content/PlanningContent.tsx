
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, GanttChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PlanningContent = () => {
  return (
    <div className="p-6 bg-white rounded-md shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Planning des Interventions</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Jour
          </Button>
          <Button variant="outline" className="bg-blue-50">
            <GanttChart className="mr-2 h-4 w-4" /> Semaine
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Mois
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <div className="grid grid-cols-7 border-b">
          <div className="p-2 text-center font-medium border-r">Lun 19/05</div>
          <div className="p-2 text-center font-medium border-r">Mar 20/05</div>
          <div className="p-2 text-center font-medium border-r bg-blue-50">Mer 21/05</div>
          <div className="p-2 text-center font-medium border-r">Jeu 22/05</div>
          <div className="p-2 text-center font-medium border-r">Ven 23/05</div>
          <div className="p-2 text-center font-medium border-r bg-gray-100">Sam 24/05</div>
          <div className="p-2 text-center font-medium bg-gray-100">Dim 25/05</div>
        </div>
        
        <div className="grid grid-cols-7 min-h-[300px]">
          <div className="border-r relative p-2">
            <div className="absolute top-2 left-2 right-2 bg-green-100 border border-green-200 rounded p-2 h-20">
              <div className="text-xs font-semibold">Équipe A</div>
              <div className="text-xs">Dupont Marc</div>
              <div className="text-xs text-gray-500">09:00 - 12:00</div>
            </div>
            <div className="absolute top-24 left-2 right-2 bg-blue-100 border border-blue-200 rounded p-2 h-20">
              <div className="text-xs font-semibold">Équipe B</div>
              <div className="text-xs">Simon Léa</div>
              <div className="text-xs text-gray-500">14:00 - 17:00</div>
            </div>
          </div>
          <div className="border-r p-2">
            <div className="absolute top-2 left-2 right-2 bg-purple-100 border border-purple-200 rounded p-2 h-20">
              <div className="text-xs font-semibold">Équipe C</div>
              <div className="text-xs">Bertrand Charles</div>
              <div className="text-xs text-gray-500">10:00 - 13:00</div>
            </div>
          </div>
          <div className="border-r p-2 bg-blue-50">
            <div className="absolute top-2 left-2 right-2 bg-amber-100 border border-amber-200 rounded p-2 h-20">
              <div className="text-xs font-semibold">Équipe A</div>
              <div className="text-xs">Martin Sophie</div>
              <div className="text-xs text-gray-500">09:30 - 12:30</div>
            </div>
          </div>
          <div className="border-r p-2">
            <div className="absolute top-2 left-2 right-2 bg-blue-100 border border-blue-200 rounded p-2 h-20">
              <div className="text-xs font-semibold">Équipe B</div>
              <div className="text-xs">Roche Antoine</div>
              <div className="text-xs text-gray-500">10:30 - 13:30</div>
            </div>
          </div>
          <div className="border-r p-2"></div>
          <div className="border-r p-2 bg-gray-100"></div>
          <div className="p-2 bg-gray-100"></div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Équipe A</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-xs text-gray-500">3 interventions cette semaine</div>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Équipe B</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-xs text-gray-500">2 interventions cette semaine</div>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '40%' }}></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Équipe C</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-xs text-gray-500">1 intervention cette semaine</div>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '20%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanningContent;
