/**
 * Database configuration for Supabase PostgreSQL
 */
export const DB_CONFIG = {
  connectionString: 'postgresql://postgres:[Pro1371997@2222]@db.abfrrzuxvbnvizlwpxea.supabase.co:5432/postgres',
} as const;

export type DB_CONFIG = typeof DB_CONFIG;