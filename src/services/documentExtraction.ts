
import mammoth from 'mammoth';
import { TextExtractionResult, VariableExtractionConfig, defaultVariablePatterns } from '@/types/documents';

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
      if (file.type === 'application/pdf') {
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
          error: `Format de fichier non pris en charge: ${file.type}`
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
      // Pour l'instant, nous ne pouvons pas extraire directement le texte d'un PDF
      // Nous renvoyons un message indiquant que l'extraction est limitée
      const text = "Extraction limitée pour les PDF. Les variables ne peuvent pas être automatiquement détectées.";
      
      return {
        text,
        variables: [],
        error: "Extraction de texte limitée pour les PDF"
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
      
      // Extraire les variables du texte
      const variables = this.extractVariables(text, customPatterns);
      
      return {
        text,
        variables,
        error: result.messages.length > 0 ? result.messages[0].message : undefined
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
    const patterns = customPatterns || defaultVariablePatterns;
    const variables = new Set<string>();
    
    patterns.forEach(config => {
      let match;
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
