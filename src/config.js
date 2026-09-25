// src/supabase-config.js

// Substitua pelas credenciais do seu projeto no painel do Supabase 
// (Project Settings -> API -> Project URL e anon / public key)
const SUPABASE_URL = 'https://vhqygvqzhsdtmebshhnk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocXlndnF6aHNkdG1lYnNoaG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyOTY2MTIsImV4cCI6MjEwNTg3MjYxMn0.MWH6JzNMHgcYxKXjMepEyFufTdQNnKlGZjApLMRUkGc';

// Inicializa o cliente do Supabase e o disponibiliza globalmente
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);