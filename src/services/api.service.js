
// services/api.service.js
const API_BASE = 'https://cert.mitain.com/api';

// Helper function for fetch requests
const fetchAPI = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

export const safetyCultureAPI = {
  // Inspections
  getInspections: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/safety-culture/inspections${queryString ? '?' + queryString : ''}`);
  },
  
  getInspectionDetails: (id) => 
    fetchAPI(`/safety-culture/inspections/${id}`),
  
  getInspectionAnswers: (id) => 
    fetchAPI(`/safety-culture/inspections/${id}/answers`),
  
  getInspectionExtended: (id) => 
    fetchAPI(`/safety-culture/inspections/${id}/details`),
  
  // Templates
  getTemplates: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/safety-culture/templates${queryString ? '?' + queryString : ''}`);
  },
  
  getTemplateById: (id) => 
    fetchAPI(`/safety-culture/templates/${id}`),
  
  getTemplateModel: (id) => 
    fetchAPI(`/safety-culture/templates/${id}/model`),
  
  getTemplateByInspection: (inspectionId, locale) => 
    fetchAPI(`/safety-culture/templates/inspections/${inspectionId}${locale ? '?locale=' + locale : ''}`),
  
  // Media
  getMediaDownloadUrl: (id, token) => 
    `${API_BASE}/safety-culture/media/${id}/download?token=${token}`
};

export const prospectsAPI = {
  getAll: () => 
    fetchAPI('/prospects'),
  
  getByToken: (beetoolToken) => 
    fetchAPI(`/prospects/${beetoolToken}`),
  
  create: (beetoolToken, data) => 
    fetchAPI(`/prospects/${beetoolToken}`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  update: (beetoolToken, data) => 
    fetchAPI(`/prospects/${beetoolToken}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
  
  delete: (beetoolToken) => 
    fetchAPI(`/prospects/${beetoolToken}`, {
      method: 'DELETE'
    })
};
