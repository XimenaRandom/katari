import AsyncStorage from '@react-native-async-storage/async-storage'; // Sin las llaves {}
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://peuqjbqwmxxghzcrkymt.supabase.co';
const supabaseAnonKey = 'sb_publishable_ZlN3Ym-RRg4yNTayXmYV4Q_nAv3S8Qs'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInBroadcast: true,
  },
});