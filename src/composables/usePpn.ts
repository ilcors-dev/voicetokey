import { invoke } from '@tauri-apps/api';
import { resolveResource, resourceDir } from '@tauri-apps/api/path';

const list = async (): Promise<string[]> => {
  const ppnPath = await resolveResource('resources/wake-words-ppn');

  const files = await invoke<string[]>('list_path_files', { path: ppnPath });

  return files as string[];
};

/**
 * Helper functions for ppn files.
 * .ppn files are used by picovoice api to recognize wake words.
 *
 * @returns object containing helper functions for ppn files
 */
export const usePpn = () => ({ list });
