
import jsPDF from 'jspdf';
import type { PhotosReportData } from '@/types/safetyCulture';

export const generatePhotosReportPDF = async (reportData: PhotosReportData): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  
  // Page de couverture
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RAPPORT PHOTOS CHANTIER', pageWidth / 2, 50, { align: 'center' });
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text(reportData.projectTitle, pageWidth / 2, 70, { align: 'center' });
  
  pdf.setFontSize(14);
  pdf.text(`Client: ${reportData.clientName}`, margin, 100);
  pdf.text(`Date d'inspection: ${new Date(reportData.auditDate).toLocaleDateString('fr-FR')}`, margin, 115);
  
  // Statistiques
  pdf.text(`Photos AVANT: ${reportData.photosAvant.length}`, margin, 140);
  pdf.text(`Photos APRÈS: ${reportData.photosApres.length}`, margin, 155);
  pdf.text(`Total: ${reportData.photosAvant.length + reportData.photosApres.length} photos`, margin, 170);
  
  // Ligne de séparation
  pdf.setLineWidth(0.5);
  pdf.line(margin, 190, pageWidth - margin, 190);
  
  pdf.setFontSize(12);
  pdf.text('Ce document présente les photos avant et après les travaux d\'isolation thermique.', margin, 210);
  pdf.text('Les photos sont organisées par catégorie et numérotées pour faciliter la lecture.', margin, 225);
  
  let currentPage = 1;
  
  // Fonction pour ajouter des photos (2 par page)
  const addPhotosSection = async (photos: any[], title: string, color: string) => {
    if (photos.length === 0) return;
    
    pdf.addPage();
    currentPage++;
    
    // Titre de section
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(color === 'blue' ? 0 : 34, color === 'blue' ? 123 : 139, color === 'blue' ? 255 : 34);
    pdf.text(title, margin, 30);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    
    for (let i = 0; i < photos.length; i += 2) {
      if (i > 0) {
        pdf.addPage();
        currentPage++;
      }
      
      const photo1 = photos[i];
      const photo2 = photos[i + 1];
      
      // Photo 1 (en haut)
      await addPhotoToPage(pdf, photo1, 50, color);
      
      // Photo 2 (en bas) si elle existe
      if (photo2) {
        await addPhotoToPage(pdf, photo2, 150, color);
      }
    }
  };
  
  // Fonction pour ajouter une photo à la page
  const addPhotoToPage = async (pdf: jsPDF, photoData: any, yPosition: number, color: string) => {
    try {
      // Créer un canvas pour redimensionner l'image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      return new Promise<void>((resolve) => {
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const maxWidth = contentWidth - 40;
          const maxHeight = 80;
          
          let { width, height } = img;
          
          // Redimensionner en gardant les proportions
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Ajouter l'image au PDF
          const imgData = canvas.toDataURL('image/jpeg', 0.8);
          const xPosition = (pageWidth - width) / 2;
          
          pdf.addImage(imgData, 'JPEG', xPosition, yPosition, width, height);
          
          // Numéro et titre
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(color === 'blue' ? 0 : 34, color === 'blue' ? 123 : 139, color === 'blue' ? 255 : 34);
          pdf.text(`${photoData.order}. `, margin, yPosition - 5);
          
          pdf.setTextColor(0, 0, 0);
          pdf.setFont('helvetica', 'normal');
          const title = photoData.photo.title || 'Photo sans titre';
          pdf.text(title, margin + 10, yPosition - 5);
          
          // Date
          pdf.setFontSize(10);
          pdf.setTextColor(100, 100, 100);
          const date = new Date(photoData.photo.created_at).toLocaleDateString('fr-FR');
          pdf.text(`Prise le ${date}`, margin, yPosition + height + 10);
          
          resolve();
        };
        
        img.onerror = () => {
          // En cas d'erreur, ajouter un placeholder
          pdf.setFillColor(240, 240, 240);
          pdf.rect(margin, yPosition, contentWidth - 40, 80, 'F');
          pdf.setTextColor(100, 100, 100);
          pdf.text('Image non disponible', pageWidth / 2, yPosition + 40, { align: 'center' });
          resolve();
        };
        
        img.src = photoData.photo.url;
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la photo:', error);
    }
  };
  
  // Ajouter les sections photos
  await addPhotosSection(reportData.photosAvant.sort((a, b) => a.order - b.order), 'PHOTOS AVANT TRAVAUX', 'blue');
  await addPhotosSection(reportData.photosApres.sort((a, b) => a.order - b.order), 'PHOTOS APRÈS TRAVAUX', 'green');
  
  // Ajouter les numéros de page
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Page ${i} / ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  }
  
  // Télécharger le PDF
  const fileName = `Rapport_Photos_${reportData.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};
