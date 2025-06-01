
import type { SafetyCultureAudit, SafetyCulturePhoto, SafetyCultureConfig } from '@/types/safetyCulture';
import { safetyCultureAPI } from './api.service';

class SafetyCultureServiceClass {
  private config: SafetyCultureConfig = {
    apiKey: '',
    baseUrl: 'https://cert.mitain.com/api'
  };

  private getApiKey(): string {
    // Récupérer la clé API depuis le localStorage ou les paramètres
    const apiKey = localStorage.getItem('safetyCulture_apiKey');
    if (!apiKey) {
      throw new Error('Clé API SafetyCulture non configurée. Veuillez la configurer dans les paramètres.');
    }
    return apiKey;
  }

  // Données mockées pour inspection et photos
  private getMockedAudit(): SafetyCultureAudit {
    return {
      id: 'audit_mock_001',
      title: 'Inspection Chantier - Sophie Martínez García',
      created_at: '2025-05-28T09:30:00.000Z',
      modified_at: '2025-05-28T16:45:00.000Z',
      template_id: 'template_isolation_001',
      template_name: 'Inspection Isolation Combles',
      audit_owner: {
        id: 'owner_001',
        firstname: 'Carlos',
        lastname: 'Rodríguez',
        email: 'carlos.rodriguez@mitain.com'
      },
      site: {
        id: 'site_madrid_001',
        name: 'Calle Mayor 123, Madrid'
      }
    };
  }

  private getMockedPhotos(): SafetyCulturePhoto[] {
    return [
      // Photos AVANT travaux
      {
        id: 'photo_avant_001',
        url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop',
        thumbnail_url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=200&h=150&fit=crop',
        title: 'Combles avant isolation - Vue générale',
        caption: 'État initial des combles perdues avant travaux d\'isolation',
        created_at: '2025-05-28T09:45:00.000Z',
        modified_at: '2025-05-28T09:45:00.000Z',
        file_size: 2456789,
        content_type: 'image/jpeg',
        width: 800,
        height: 600,
        item_id: 'item_001',
        question_id: 'q_avant_general'
      },
      {
        id: 'photo_avant_002',
        url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&h=600&fit=crop',
        thumbnail_url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=200&h=150&fit=crop',
        title: 'Plancher existant',
        caption: 'Plancher béton avant pose isolation',
        created_at: '2025-05-28T09:50:00.000Z',
        modified_at: '2025-05-28T09:50:00.000Z',
        file_size: 1987654,
        content_type: 'image/jpeg',
        width: 800,
        height: 600,
        item_id: 'item_002',
        question_id: 'q_avant_plancher'
      },
      {
        id: 'photo_avant_003',
        url: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=800&h=600&fit=crop',
        thumbnail_url: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=200&h=150&fit=crop',
        title: 'Accès combles',
        caption: 'Trappe d\'accès aux combles perdues',
        created_at: '2025-05-28T09:55:00.000Z',
        modified_at: '2025-05-28T09:55:00.000Z',
        file_size: 2123456,
        content_type: 'image/jpeg',
        width: 800,
        height: 600,
        item_id: 'item_003',
        question_id: 'q_avant_acces'
      },
      {
        id: 'photo_avant_004',
        url: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800&h=600&fit=crop',
        thumbnail_url: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=200&h=150&fit=crop',
        title: 'Zone de travail avant',
        caption: 'Préparation de la zone avant installation',
        created_at: '2025-05-28T10:00:00.000Z',
        modified_at: '2025-05-28T10:00:00.000Z',
        file_size: 2345678,
        content_type: 'image/jpeg',
        width: 800,
        height: 600,
        item_id: 'item_004',
        question_id: 'q_avant_zone'
      },
      // Photos APRÈS travaux
      {
        id: 'photo_apres_001',
        url: 'https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=800&h=600&fit=crop',
        thumbnail_url: 'https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=200&h=150&fit=crop',
        title: 'Isolation terminée - Vue générale',
        caption: 'Isolation des combles perdues terminée - 95m² traités',
        created_at: '2025-05-28T15:30:00.000Z',
        modified_at: '2025-05-28T15:30:00.000Z',
        file_size: 2654321,
        content_type: 'image/jpeg',
        width: 800,
        height: 600,
        item_id: 'item_005',
        question_id: 'q_apres_general'
      },
      {
        id: 'photo_apres_002',
        url: 'https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=800&h=600&fit=crop',
        thumbnail_url: 'https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=200&h=150&fit=crop',
        title: 'Épaisseur isolation',
        caption: 'Épaisseur 30cm de laine de verre soufflée',
        created_at: '2025-05-28T15:45:00.000Z',
        modified_at: '2025-05-28T15:45:00.000Z',
        file_size: 2456789,
        content_type: 'image/jpeg',
        width: 800,
        height: 600,
        item_id: 'item_006',
        question_id: 'q_apres_epaisseur'
      },
      {
        id: 'photo_apres_003',
        url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop',
        thumbnail_url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=200&h=150&fit=crop',
        title: 'Finition propre',
        caption: 'Finition soignée et nettoyage effectué',
        created_at: '2025-05-28T16:00:00.000Z',
        modified_at: '2025-05-28T16:00:00.000Z',
        file_size: 2234567,
        content_type: 'image/jpeg',
        width: 800,
        height: 600,
        item_id: 'item_007',
        question_id: 'q_apres_finition'
      },
      {
        id: 'photo_apres_004',
        url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&h=600&fit=crop',
        thumbnail_url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=200&h=150&fit=crop',
        title: 'Contrôle qualité',
        caption: 'Vérification finale de l\'isolation posée',
        created_at: '2025-05-28T16:15:00.000Z',
        modified_at: '2025-05-28T16:15:00.000Z',
        file_size: 2345678,
        content_type: 'image/jpeg',
        width: 800,
        height: 600,
        item_id: 'item_008',
        question_id: 'q_apres_controle'
      },
      // Photos supplémentaires pour choix
      {
        id: 'photo_extra_001',
        url: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=800&h=600&fit=crop',
        thumbnail_url: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=200&h=150&fit=crop',
        title: 'Matériel utilisé',
        caption: 'Laine de verre haute performance R=7.5',
        created_at: '2025-05-28T14:00:00.000Z',
        modified_at: '2025-05-28T14:00:00.000Z',
        file_size: 1876543,
        content_type: 'image/jpeg',
        width: 800,
        height: 600,
        item_id: 'item_009',
        question_id: 'q_materiel'
      },
      {
        id: 'photo_extra_002',
        url: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800&h=600&fit=crop',
        thumbnail_url: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=200&h=150&fit=crop',
        title: 'Équipe au travail',
        caption: 'Installation par l\'équipe certifiée RGE',
        created_at: '2025-05-28T13:30:00.000Z',
        modified_at: '2025-05-28T13:30:00.000Z',
        file_size: 2109876,
        content_type: 'image/jpeg',
        width: 800,
        height: 600,
        item_id: 'item_010',
        question_id: 'q_equipe'
      }
    ];
  }

  async getSafetyCultureReportURL(projectId: string): Promise<string | null> {
    try {
      // Utiliser la nouvelle API
      const response = await safetyCultureAPI.getInspectionDetails(projectId);
      
      return response.report_url || null;
    } catch (error) {
      console.error('Erreur lors de la récupération du rapport SafetyCulture:', error);
      return null;
    }
  }

  async getAudits(): Promise<SafetyCultureAudit[]> {
    try {
      // Ajouter l'audit mocké en premier
      const mockedAudit = this.getMockedAudit();
      let allAudits = [mockedAudit];

      try {
        const response = await safetyCultureAPI.getInspections({ limit: 50 });
        
        // Transformer les inspections en audits
        const audits = response.items?.map((inspection: any) => ({
          id: inspection.id,
          title: inspection.audit_title || inspection.site_name || 'Inspection sans titre',
          created_at: inspection.created_at,
          modified_at: inspection.modified_at,
          template_id: inspection.template_id,
          template_name: inspection.template_name,
          audit_owner: {
            id: inspection.owner_id,
            firstname: inspection.owner_firstname || 'Propriétaire',
            lastname: inspection.owner_lastname || 'Inconnu',
            email: inspection.owner_email || ''
          },
          site: {
            id: inspection.site_id,
            name: inspection.site_name || 'Site inconnu'
          }
        })) || [];
        
        // Ajouter les audits de l'API après l'audit mocké
        allAudits = [mockedAudit, ...audits];
      } catch (apiError) {
        console.warn("Erreur API SafetyCulture, utilisation de l'audit mocké uniquement:", apiError);
      }
      
      return allAudits;
    } catch (error) {
      console.error('Erreur lors de la récupération des audits:', error);
      // En cas d'erreur, retourner au moins l'audit mocké
      return [this.getMockedAudit()];
    }
  }

  async getAuditPhotos(auditId: string): Promise<SafetyCulturePhoto[]> {
    try {
      // Si c'est l'audit mocké, retourner les photos mockées
      if (auditId === 'audit_mock_001') {
        return this.getMockedPhotos();
      }

      const response = await safetyCultureAPI.getInspectionAnswers(auditId);

      const photos: SafetyCulturePhoto[] = [];
      
      // Parcourir les réponses pour extraire les photos
      response.answers?.forEach((answer: any) => {
        if (answer.type === 'image' && answer.image_url) {
          photos.push({
            id: answer.id,
            url: answer.image_url,
            thumbnail_url: answer.thumbnail_url || answer.image_url,
            title: answer.title || 'Photo inspection',
            caption: answer.caption,
            created_at: answer.created_at,
            modified_at: answer.modified_at,
            file_size: answer.file_size || 0,
            content_type: 'image/jpeg',
            width: answer.width,
            height: answer.height,
            item_id: answer.item_id,
            question_id: answer.question_id
          });
        }
      });

      return photos;
    } catch (error) {
      console.error('Erreur lors de la récupération des photos:', error);
      return [];
    }
  }

  setApiKey(apiKey: string): void {
    localStorage.setItem('safetyCulture_apiKey', apiKey);
    this.config.apiKey = apiKey;
  }

  getStoredApiKey(): string | null {
    return localStorage.getItem('safetyCulture_apiKey');
  }
}

export const SafetyCultureService = new SafetyCultureServiceClass();
