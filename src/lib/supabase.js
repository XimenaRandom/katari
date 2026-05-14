import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://peuqjbqwmxxghzcrkymt.supabase.co'
const supabaseAnonKey = 'sb_publishable_ZlN3Ym-RRg4yNTayXmYV4Q_nAv3S8Qs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
