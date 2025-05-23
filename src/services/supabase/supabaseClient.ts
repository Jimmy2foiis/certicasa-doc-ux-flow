// Rétro-compatibilité : on continue d'exposer le client Supabase afin que
// les services documents / cadastrales, etc. fonctionnent le temps de la
// migration complète.  Il pointe vers le client centralisé dans
// src/integrations/supabase/client.ts.

import { supabase } from '@/integrations/supabase/client';

export { supabase };
