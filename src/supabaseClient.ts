import { createClient } from '@supabase/supabase-js';

// Exact Supabase credentials provided by the user
const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL || 'https://uotyxjztiraxjccswzlo.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvdHl4anp0aXJheGpjY3N3emxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MTQyMjgsImV4cCI6MjA5MTE5MDIyOH0.PUKK-lP1O4TDsxMA6emGtCjxKSOQD2GwFGm_hgkuwzc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Verification and health check for tables
export interface TableStatus {
  times: boolean;
  empresas: boolean;
  usuarios: boolean;
  comprovantes: boolean;
  ranking: boolean;
  financeiro: boolean;
  notificacoes: boolean;
  copas: boolean;
  videos: boolean;
}

export async function checkTablesAvailability(): Promise<{ status: TableStatus; errors: Record<string, string> }> {
  const status: TableStatus = {
    times: false,
    empresas: false,
    usuarios: false,
    comprovantes: false,
    ranking: false,
    financeiro: false,
    notificacoes: false,
    copas: false,
    videos: false,
  };
  
  const errors: Record<string, string> = {};

  const checkTable = async (tableName: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from(tableName).select('id').limit(1);
      if (error) {
        errors[tableName] = error.message;
        // If error code is 'PGRST116' (no rows matched or similar) it might actually exist
        if (error.code === 'PGRST116') return true;
        return false;
      }
      return true;
    } catch (e: any) {
      errors[tableName] = e.message || 'Erro desconhecido';
      return false;
    }
  };

  status.times = await checkTable('times');
  status.empresas = await checkTable('empresas');
  status.usuarios = await checkTable('usuarios');
  status.comprovantes = await checkTable('comprovantes');
  status.ranking = await checkTable('ranking');
  status.financeiro = await checkTable('financeiro');
  status.notificacoes = await checkTable('notificacoes');
  status.copas = await checkTable('copas');
  status.videos = await checkTable('videos');
  return { status, errors };
}

/**
 * Uploads a file to a Supabase Storage bucket and returns its public URL.
 * Automatically attempts to create the bucket (fails gracefully if bucket exists or lacks permission).
 */
export async function uploadFileToStorage(file: File | Blob, bucketName: string, customFileName?: string): Promise<string> {
  const originalName = (file as File).name || 'upload.jpg';
  const fileExt = originalName.split('.').pop() || 'jpg';
  const uniqueId = Math.random().toString(36).substring(2, 11);
  const fileName = customFileName || `${Date.now()}-${uniqueId}.${fileExt}`;

  try {
    await supabase.storage.createBucket(bucketName, { public: true });
  } catch (e) {
    // Ignore error if bucket already exists or lacks bucket creation permissions
  }

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  return publicUrl;
}

