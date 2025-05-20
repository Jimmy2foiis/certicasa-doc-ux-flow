
import { FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const SignaturesTabContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Signatures Collectées</CardTitle>
        <CardDescription>
          Signatures obtenues pour documents et contrats
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((signature) => (
            <div 
              key={signature} 
              className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
            >
              <div className="flex items-center">
                <FileSignature className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <h4 className="font-medium">Contrat de travaux #{signature}</h4>
                  <p className="text-sm text-gray-500">Signé le: 15/05/2023</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Voir signature
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SignaturesTabContent;
