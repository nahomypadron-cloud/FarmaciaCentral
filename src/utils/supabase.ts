import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://tetskmoufwelearrtozv.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRldHNrbW91ZndlbGVhcnJ0b3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNzM2NTMsImV4cCI6MjA5MTk0OTY1M30.WwbLqNmyJ2Aig64ZH3xb1wwkGunw55jbl2rJuh2ClBs"

export const supabase = createClient(supabaseUrl, supabaseKey)