import mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';
import type { TextExtractionResult, VariableExtractionConfig } from '@/types/documents';
import { defaultVariablePatterns } from '@/types/documents';

// Charger le worker PDF.js nécessaire pour l'extraction de texte des PDF
const pdfWorkerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

export class DocumentExtractionService {
  /**
   * Extrait le texte et les variables d'un fichier
   * @param file Fichier à traiter (PDF ou DOCX)
   * @returns Résultat de l'extraction avec texte et variables
   */
  static async extractTextAndVariables(
    file: File,
    variableConfigs: VariableExtractionConfig[] = defaultVariablePatterns
  ): Promise<TextExtractionResult> {
    try {
      console.log(`Début de l'extraction de texte pour ${file.name}`);
      
      // Déterminer le type de fichier
      const fileType = file.name.split('.').pop()?.toLowerCase();
      let text = '';
      
      // Selon le type de fichier, utiliser la méthode appropriée
      if (fileType === 'docx') {
        text = await this.extractFromDOCX(file);
      } else if (fileType === 'pdf') {
        text = await this.extractFromPDF(file);
      } else {
        throw new Error(`Type de fichier non supporté: ${fileType}`);
      }
      
      // Vérifier si du texte a été extrait
      if (!text || text.trim().length === 0) {
        return {
          text: '',
          variables: [],
          error: "Aucun texte n'a pu être extrait du fichier. Vérifiez qu'il n'est pas vide ou corrompu."
        };
      }
      
      // Extraire les variables du texte
      const variables = this.extractVariables(text, variableConfigs);
      
      console.log(`Extraction réussie: ${variables.length} variables trouvées`);
      
      return {
        text,
        variables,
        error: undefined
      };
    } catch (error) {
      console.error("Erreur lors de l'extraction:", error);
      return {
        text: '',
        variables: [],
        error: error instanceof Error ? error.message : "Erreur inconnue lors de l'extraction"
      };
    }
  }
  
  /**
   * Extrait le texte d'un fichier DOCX
   */
  private static async extractFromDOCX(file: File): Promise<string> {
    try {
      // Lire le contenu du fichier
      const arrayBuffer = await file.arrayBuffer();
      
      // Utiliser mammoth pour convertir DOCX en texte
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      if (!result || !result.value) {
        throw new Error("Échec de l'extraction du texte du fichier DOCX");
      }
      
      return result.value;
    } catch (error) {
      console.error("Erreur lors de l'extraction du texte DOCX:", error);
      throw error;
    }
  }
  
  /**
   * Extrait le texte d'un fichier PDF
   */
  private static async extractFromPDF(file: File): Promise<string> {
    try {
      // Lire le contenu du fichier
      const arrayBuffer = await file.arrayBuffer();
      
      // Charger le document PDF
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      const numPages = pdf.numPages;
      let fullText = '';
      
      // Extraire le texte de chaque page
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n\n';
      }
      
      return fullText;
    } catch (error) {
      console.error("Erreur lors de l'extraction du texte PDF:", error);
      throw error;
    }
  }
  
  /**
   * Extrait les variables d'un texte selon les motifs configurés
   */
  static extractVariables(
    text: string,
    variableConfigs: VariableExtractionConfig[] = defaultVariablePatterns
  ): string[] {
    const variables: string[] = [];
    
    try {
      // Appliquer chaque configuration de motif pour extraire les variables
      for (const config of variableConfigs) {
        const { pattern } = config;
        let match;
        
        // Réinitialiser le regex pour chaque itération
        pattern.lastIndex = 0;
        
        while ((match = pattern.exec(text)) !== null) {
          if (match[0] && !variables.includes(match[0])) {
            variables.push(match[0]);
          }
        }
      }
      
      return [...new Set(variables)]; // Éliminer les doublons
    } catch (error) {
      console.error("Erreur lors de l'extraction des variables:", error);
      return variables;
    }
  }
}
