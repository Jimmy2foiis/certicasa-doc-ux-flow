
import { createClient } from '@supabase/supabase-js';

// Constantes de configuration Supabase
const SUPABASE_URL = 'https://tedweevlyvduuxndixsl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZHdlZXZseXZkdXV4bmRpeHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NjUyNDgsImV4cCI6MjA2MzM0MTI0OH0.C2ofsxnXb2_mUt6EOISxx7YetMQ62n9ZNSox5b-s-jY';

// Création du client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonctions d'authentification
export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password,
  });
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  return await supabase.auth.getUser();
};

// Fonctions pour gérer les clients
export const getClients = async () => {
  const { data, error } = await supabase
    .from('clients')
    .select('*');
  
  if (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    return [];
  }
  
  return data;
};

export const createClientRecord = async (clientData: any) => {
  const { data, error } = await supabase
    .from('clients')
    .insert([clientData])
    .select();
  
  if (error) {
    console.error('Erreur lors de la création du client:', error);
    return null;
  }
  
  return data?.[0] || null;
};

// Fonctions pour gérer les données cadastrales
export const saveCadastralData = async (clientId: string, cadastralData: any) => {
  const { data, error } = await supabase
    .from('cadastral_data')
    .insert([{
      client_id: clientId,
      utm_coordinates: cadastralData.utmCoordinates,
      cadastral_reference: cadastralData.cadastralReference,
      climate_zone: cadastralData.climateZone,
      created_at: new Date().toISOString()
    }])
    .select();
  
  if (error) {
    console.error('Erreur lors de la sauvegarde des données cadastrales:', error);
    return null;
  }
  
  return data?.[0] || null;
};

export const getCadastralDataForClient = async (clientId: string) => {
  const { data, error } = await supabase
    .from('cadastral_data')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(1);
  
  if (error) {
    console.error('Erreur lors de la récupération des données cadastrales:', error);
    return null;
  }
  
  return data?.[0] || null;
};
