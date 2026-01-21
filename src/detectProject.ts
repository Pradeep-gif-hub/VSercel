import * as fs from 'fs';
import * as path from 'path';

export type ProjectType = 'next.js' | 'vite' | 'static';

export function detectProjectType(workspaceRoot: string): ProjectType {
  // Check for Next.js
  const nextConfigPath = path.join(workspaceRoot, 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    return 'next.js';
  }

  // Check for Vite
  const viteConfigTsPath = path.join(workspaceRoot, 'vite.config.ts');
  const viteConfigJsPath = path.join(workspaceRoot, 'vite.config.js');
  if (fs.existsSync(viteConfigTsPath) || fs.existsSync(viteConfigJsPath)) {
    return 'vite';
  }

  // Default to static site
  return 'static';
}
