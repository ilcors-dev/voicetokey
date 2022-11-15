import { invoke } from '@tauri-apps/api';
import { resolveResource, resourceDir } from '@tauri-apps/api/path';

const list = async (): Promise<string[]> => {
  const pvPath = await resolveResource('resources/languages-pv');

  const files = await invoke<string[]>('list_path_files', { path: pvPath });

  return files as string[];
};

/**
 * Helper functions for pv files.
 * .pv files are used by picovoice to recognize wake words languages.
 *
 * NOTE: mismatching languages and wake words will cause picovoice to fail.
 *
 * @returns object containing helper functions for pv files
 */
export const usePv = () => ({ list });
