
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Wallet, FileText, Calendar, FileCheck, FileClock, MinusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock invoice data structure matching our client schema
interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  fileId?: string;
  fileUrl?: string;
}

// Mock credit note data structure
interface CreditNote {
  id: string;
  number: string;
  date: string;
  amount: number;
  reason: string;
  invoiceRef?: string;
  fileId?: string;
  fileUrl?: string;
}

interface EnhancedBillingTabProps {
  clientId: string;
  clientName: string;
}

const EnhancedBillingTab = ({ clientId, clientName }: EnhancedBillingTabProps) => {
  const [activeTab, setActiveTab] = useState<string>("invoices");
  const { toast } = useToast();
  
  // Mock invoices - in a real app, these would come from the Files table with FACTURAS type
  const invoices: Invoice[] = [
    {
      id: '1',
      number: 'FAC-2023-001',
      date: '2023-05-10',
      amount: 1250,
      status: 'paid',
      fileId: 'file123',
      fileUrl: 'https://example.com/file123'
    },
    {
      id: '2',
      number: 'FAC-2023-002',
      date: '2023-06-15',
      amount: 750,
      status: 'paid',
      fileId: 'file456',
      fileUrl: 'https://example.com/file456'
    },
    {
      id: '3',
      number: 'FAC-2023-003',
      date: '2023-07-20',
      amount: 2100,
      status: 'pending',
      fileId: 'file789',
      fileUrl: 'https://example.com/file789'
    }
  ];
  
  // Mock credit notes
  const creditNotes: CreditNote[] = [
    {
      id: '1',
      number: 'NC-2023-001',
      date: '2023-05-25',
      amount: 250,
      reason: 'Remise commerciale',
      invoiceRef: 'FAC-2023-001',
      fileId: 'file-nc-123',
      fileUrl: 'https://example.com/file-nc-123'
    },
    {
      id: '2',
      number: 'NC-2023-002',
      date: '2023-08-05',
      amount: 350,
      reason: 'Correction de facturation',
      invoiceRef: 'FAC-2023-003',
      fileId: 'file-nc-456',
      fileUrl: 'https://example.com/file-nc-456'
    }
  ];
  
  // Calculate summary stats
  const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalCreditNotes = creditNotes.reduce((sum, note) => sum + note.amount, 0);
  const totalPaid = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalPending = invoices
    .filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const netTotal = totalInvoiced - totalCreditNotes;
  
  // Handle view invoice
  const handleViewInvoice = (invoice: Invoice) => {
    toast({
      title: "Facture ouverte",
      description: `Visualisation de la facture ${invoice.number}`
    });
  };
  
  // Handle download invoice
  const handleDownloadInvoice = (invoice: Invoice) => {
    toast({
      title: "Téléchargement démarré",
      description: `Téléchargement de la facture ${invoice.number}`
    });
  };

  // Handle view credit note
  const handleViewCreditNote = (creditNote: CreditNote) => {
    toast({
      title: "Note de crédit ouverte",
      description: `Visualisation de la note de crédit ${creditNote.number}`
    });
  };
  
  // Handle download credit note
  const handleDownloadCreditNote = (creditNote: CreditNote) => {
    toast({
      title: "Téléchargement démarré",
      description: `Téléchargement de la note de crédit ${creditNote.number}`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Facturation</CardTitle>
        <CardDescription>Gestion de la facturation de {clientName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground text-sm">Total facturé</p>
                  <p className="text-2xl font-semibold">{totalInvoiced.toLocaleString('fr-FR')} €</p>
                </div>
                <Wallet className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground text-sm">Notes de crédit</p>
                  <p className="text-2xl font-semibold text-red-500">-{totalCreditNotes.toLocaleString('fr-FR')} €</p>
                </div>
                <MinusCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground text-sm">Montant payé</p>
                  <p className="text-2xl font-semibold">{totalPaid.toLocaleString('fr-FR')} €</p>
                </div>
                <FileCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground text-sm">En attente</p>
                  <p className="text-2xl font-semibold">{totalPending.toLocaleString('fr-FR')} €</p>
                </div>
                <FileClock className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="invoices" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Factures</span>
            </TabsTrigger>
            <TabsTrigger value="credit-notes" className="flex items-center gap-1">
              <MinusCircle className="h-4 w-4" />
              <span>Notes de crédit</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Paiements</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              <span>Statistiques</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="invoices" className="space-y-4">
            {invoices.map((invoice) => (
              <div 
                key={invoice.id} 
                className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30"
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <h4 className="font-medium">{invoice.number}</h4>
                    <p className="text-sm text-muted-foreground">
                      Date: {new Date(invoice.date).toLocaleDateString('fr-FR')} - 
                      Montant: {invoice.amount.toLocaleString('fr-FR')} €
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={
                      invoice.status === 'paid' ? 'default' : 
                      invoice.status === 'pending' ? 'outline' : 
                      'destructive'
                    }
                  >
                    {invoice.status === 'paid' ? 'Payée' : 
                     invoice.status === 'pending' ? 'En attente' : 
                     'En retard'}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewInvoice(invoice)}
                  >
                    Voir
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadInvoice(invoice)}
                  >
                    Télécharger
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="mt-4 flex justify-end">
              <Button>Nouvelle facture</Button>
            </div>
          </TabsContent>

          <TabsContent value="credit-notes" className="space-y-4">
            {creditNotes.length > 0 ? (
              creditNotes.map((creditNote) => (
                <div 
                  key={creditNote.id} 
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30"
                >
                  <div className="flex items-center">
                    <MinusCircle className="h-5 w-5 text-red-500 mr-3" />
                    <div>
                      <h4 className="font-medium">{creditNote.number}</h4>
                      <p className="text-sm text-muted-foreground">
                        Date: {new Date(creditNote.date).toLocaleDateString('fr-FR')} - 
                        Montant: -{creditNote.amount.toLocaleString('fr-FR')} €
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Motif: {creditNote.reason} {creditNote.invoiceRef && `- Réf: ${creditNote.invoiceRef}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewCreditNote(creditNote)}
                    >
                      Voir
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadCreditNote(creditNote)}
                    >
                      Télécharger
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <MinusCircle className="h-12 w-12 mb-2 opacity-30" />
                <p>Aucune note de crédit trouvée pour ce client</p>
              </div>
            )}
            
            <div className="mt-4 flex justify-end">
              <Button>Créer une note de crédit</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="payments">
            <div className="flex items-center justify-center h-48 border rounded-md">
              <p className="text-muted-foreground">Fonctionnalité à venir</p>
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="flex items-center justify-center h-48 border rounded-md">
              <p className="text-muted-foreground">Statistiques à venir</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedBillingTab;
