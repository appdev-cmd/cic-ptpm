import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bpmatlkrotoftowpsbcz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwbWF0bGtyb3RvZnRvd3BzYmN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzODkyNDMsImV4cCI6MjA5OTk2NTI0M30.4oVzni6kQdjG7XitQLNA2qjPRTkjVTs1s9PqhNeiqw8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
