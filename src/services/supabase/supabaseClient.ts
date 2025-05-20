
import { createClient } from '@supabase/supabase-js';

// Constantes de configuration Supabase
const SUPABASE_URL = 'https://tedweevlyvduuxndixsl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZHdlZXZseXZkdXV4bmRpeHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NjUyNDgsImV4cCI6MjA2MzM0MTI0OH0.C2ofsxnXb2_mUt6EOISxx7YetMQ62n9ZNSox5b-s-jY';

// Création du client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
