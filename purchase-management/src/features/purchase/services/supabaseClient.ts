import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://abfrrzuxvbnvizlwpxea.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiZnJyenV4dmJudml6bHdweGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MTQ4MDEsImV4cCI6MjA5ODI5MDgwMX0.A9AzG5eHUseszQ_MoN0NuQSo2TX2FXmIHpeih87bdn0';

export const supabase = createClient(supabaseUrl, supabaseKey);
