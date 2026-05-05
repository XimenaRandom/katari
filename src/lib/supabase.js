import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://TU_PROYECTO.supabase.co';
const supabaseAnonKey = 'TU_LLAVE_ANON_PUBLIC';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInBroadcast: true,
  },
});