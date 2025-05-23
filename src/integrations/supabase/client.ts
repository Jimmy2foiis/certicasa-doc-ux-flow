// Ce fichier est conservé pour la rétrocompatibilité
// Il ne fait plus appel à Supabase mais aux APIs REST

// Nous créons un objet factice qui ne fait rien pour éviter les erreurs
// lors de la transition vers l'API REST

export { supabase } from '@/services/supabase/supabaseClient';
