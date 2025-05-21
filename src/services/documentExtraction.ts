
import mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';
import { TextExtractionResult, VariableExtractionConfig, defaultVariablePatterns } from '@/types/documents';

// Initialiser pdfjs avec le worker
const pdfjsWorkerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;

/**
 * Service d'extraction de texte et de variables depuis différents formats de document
 */
export class DocumentExtractionService {
  /**
   * Extrait le texte et les variables d'un fichier PDF ou DOCX
   */
  static async extractTextAndVariables(file: File, customPatterns?: VariableExtractionConfig[]): Promise<TextExtractionResult> {
    try {
      // Vérifier le type de fichier
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        return this.extractFromPDF(file, customPatterns);
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.toLowerCase().endsWith('.docx')
      ) {
        return this.extractFromDOCX(file, customPatterns);
      } else {
        return {
          text: '',
          variables: [],
          error: `Format de fichier non pris en charge: ${file.type || file.name.split('.').pop()}`
        };
      }
    } catch (error) {
      console.error('Erreur lors de l\'extraction du texte:', error);
      return {
        text: '',
        variables: [],
        error: `Erreur lors de l'extraction: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Extrait le texte et les variables d'un fichier PDF
   */
  private static async extractFromPDF(file: File, customPatterns?: VariableExtractionConfig[]): Promise<TextExtractionResult> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Extraire le texte de chaque page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .filter(item => 'str' in item)
          .map(item => 'str' in item ? item.str : '')
          .join(' ');
          
        fullText += pageText + '\n';
      }
      
      // Si le texte extrait est vide ou trop court, c'est probablement un PDF scanné ou une image
      if (!fullText || fullText.trim().length < 10) {
        return {
          text: '',
          variables: [],
          error: "Ce PDF ne contient pas de texte extractible. Il pourrait s'agir d'un document scanné ou d'une image."
        };
      }
      
      // Extraire les variables du texte
      const variables = this.extractVariables(fullText, customPatterns);
      
      return {
        text: fullText,
        variables,
        error: variables.length === 0 ? "Aucune variable n'a été détectée dans ce document." : undefined
      };
    } catch (error) {
      console.error('Erreur lors de l\'extraction du texte PDF:', error);
      return {
        text: '',
        variables: [],
        error: `Erreur lors de l'extraction du PDF: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Extrait le texte et les variables d'un fichier DOCX
   */
  private static async extractFromDOCX(file: File, customPatterns?: VariableExtractionConfig[]): Promise<TextExtractionResult> {
    try {
      // Lire le contenu du fichier
      const arrayBuffer = await file.arrayBuffer();
      
      // Extraire le texte avec mammoth
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;
      
      // Vérifier si le texte extrait est valide
      if (!text || text.trim().length < 10) {
        return {
          text: '',
          variables: [],
          error: "Le document DOCX ne contient pas de texte extractible ou est vide."
        };
      }
      
      // Extraire les variables du texte
      const variables = this.extractVariables(text, customPatterns);
      
      return {
        text,
        variables,
        error: variables.length === 0 ? "Aucune variable n'a été détectée dans ce document." : undefined
      };
    } catch (error) {
      console.error('Erreur lors de l\'extraction du texte DOCX:', error);
      return {
        text: '',
        variables: [],
        error: `Erreur lors de l'extraction du DOCX: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Extrait les variables d'un texte selon des patterns définis
   */
  static extractVariables(text: string, customPatterns?: VariableExtractionConfig[]): string[] {
    if (!text || text.trim().length === 0) {
      return [];
    }
    
    const patterns = customPatterns || defaultVariablePatterns;
    const variables = new Set<string>();
    
    patterns.forEach(config => {
      let match;
      // Réinitialiser lastIndex pour éviter les boucles infinies
      config.pattern.lastIndex = 0;
      
      while ((match = config.pattern.exec(text)) !== null) {
        if (match[1]) {
          variables.add(match[1].trim());
        }
      }
    });
    
    return Array.from(variables);
  }
}

// Fonction utilitaire pour déterminer le type de fichier à partir de son nom ou type MIME
export const getFileType = (file: File): 'pdf' | 'docx' | 'xlsx' | 'unknown' => {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  
  if (name.endsWith('.pdf') || type.includes('pdf')) {
    return 'pdf';
  } else if (name.endsWith('.docx') || type.includes('officedocument.wordprocessingml.document')) {
    return 'docx';
  } else if (name.endsWith('.xlsx') || type.includes('officedocument.spreadsheetml.sheet')) {
    return 'xlsx';
  } else {
    return 'unknown';
  }
};
