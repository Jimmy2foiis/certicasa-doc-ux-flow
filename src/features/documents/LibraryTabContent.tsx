import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useDocumentTemplates } from '@/hooks/useDocumentTemplates';
import { DocumentTemplate } from '@/types/documents';
import { useTemplateActions } from '@/hooks/useTemplateActions';
import DocumentTemplateCard from './DocumentTemplateCard';
import DocumentPreviewDialog from './DocumentPreviewDialog';
import DeleteTemplateDialog from './DeleteTemplateDialog';
import EmptyTemplateState from './EmptyTemplateState';
import DocumentLoadingState from './DocumentLoadingState';

interface LibraryTabContentProps {
  loading: boolean;
  filteredTemplates: DocumentTemplate[];
  setActiveTab: (tab: string) => void;
}

const LibraryTabContent = ({
  loading,
  filteredTemplates,
  setActiveTab,
}: LibraryTabContentProps) => {
  const { removeTemplate, forceRefresh } = useDocumentTemplates();
  const [templateToDelete, setTemplateToDelete] = React.useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const { previewTemplate, showPreview, handlePreview, closePreview, handleUseTemplate } =
    useTemplateActions(setActiveTab);

  // Fonction pour confirmer la suppression
  const confirmDelete = (templateId: string) => {
    setTemplateToDelete(templateId);
  };

  // Fonction pour effectuer la suppression
  const handleDelete = () => {
    if (templateToDelete) {
      removeTemplate(templateToDelete);
      setTemplateToDelete(null);
    }
  };

  // Fonction pour annuler la suppression
  const cancelDelete = () => {
    setTemplateToDelete(null);
  };

  // Fonction pour rafraîchir la liste des modèles
  const handleRefresh = () => {
    setIsRefreshing(true);
    forceRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const renderTemplateGrid = () => {
    if (filteredTemplates.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <DocumentTemplateCard
              key={template.id}
              template={template}
              handlePreview={handlePreview}
              confirmDelete={confirmDelete}
              handleUseTemplate={handleUseTemplate}
            />
          ))}
        </div>
      );
    }

    return <EmptyTemplateState setActiveTab={setActiveTab} />;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Bibliothèque de Documents</CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={isRefreshing ? 'animate-spin' : ''}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {loading || isRefreshing ? <DocumentLoadingState /> : renderTemplateGrid()}
      </CardContent>

      {/* Dialogues */}
      <DocumentPreviewDialog
        showPreview={showPreview}
        closePreview={closePreview}
        previewTemplate={previewTemplate}
        handleUseTemplate={handleUseTemplate}
      />

      <DeleteTemplateDialog
        templateToDelete={templateToDelete}
        cancelDelete={cancelDelete}
        handleDelete={handleDelete}
      />
    </Card>
  );
};

export default LibraryTabContent;
