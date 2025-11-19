import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://skcfvsarhmkuxealccxa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2Z2c2FyaG1rdXhlYWxjY3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MTE1MTAsImV4cCI6MjA3OTA4NzUxMH0.G6ezFcGPXG45j2iweI_G-9XwwJQgHJko2LHtD7KotT4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
