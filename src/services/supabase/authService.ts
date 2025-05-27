
// Fonctions d'authentification avec l'API REST
const API_BASE = 'https://cert.mitain.com/api';

export const signUp = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    return {
      data: response.ok ? data : null,
      error: !response.ok ? { message: data.message || 'Erreur d\'inscription' } : null
    };
  } catch (error) {
    return {
      data: null,
      error: { message: 'Erreur de connexion à l\'API' }
    };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    // Stocker le token d'authentification si présent
    if (response.ok && data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    
    return {
      data: response.ok ? data : null,
      error: !response.ok ? { message: data.message || 'Erreur de connexion' } : null
    };
  } catch (error) {
    return {
      data: null,
      error: { message: 'Erreur de connexion à l\'API' }
    };
  }
};

export const signOut = async () => {
  // Simplement supprimer le token local
  localStorage.removeItem('auth_token');
  
  return {
    error: null
  };
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    return {
      data: { user: null },
      error: { message: 'Utilisateur non connecté' }
    };
  }
  
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    return {
      data: { user: response.ok ? data : null },
      error: !response.ok ? { message: data.message || 'Erreur lors de la récupération des informations utilisateur' } : null
    };
  } catch (error) {
    return {
      data: { user: null },
      error: { message: 'Erreur de connexion à l\'API' }
    };
  }
};
