
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Send } from "lucide-react";
import QueuedClientsList from "./components/QueuedClientsList";
import BatchSendSection from "./components/BatchSendSection";
import { useCertificateQueue } from "@/hooks/useCertificateQueue";

const SendPage = () => {
  const { totalCount, selectedCount } = useCertificateQueue();

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Envoi groupé de certificats énergétiques
            </h2>
            <p className="text-gray-600">
              Gérez et envoyez les certificats énergétiques par lot
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{totalCount}</div>
            <div className="text-sm text-gray-600">clients en attente</div>
          </div>
        </div>
      </div>

      {/* Liste des clients en attente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            File d'attente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QueuedClientsList />
        </CardContent>
      </Card>

      {/* Section d'envoi groupé */}
      {selectedCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Envoi groupé ({selectedCount} sélectionné{selectedCount > 1 ? 's' : ''})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BatchSendSection />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SendPage;
