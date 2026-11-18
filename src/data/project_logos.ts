import type { ImageMetadata } from 'astro';

/**
 * Logo of each project, found by the project key (the file name in
 * src/content/work). To add one, drop `src/assets/logos/<key>.svg` and, when
 * the logo is a mark next to a name, list the wordmark parts: the second one
 * is shown in the accent color. A project without a file simply shows no logo.
 */
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/logos/*.svg', { eager: true });

const wordmarks: Record<string, [string, string, string?]> = {
  // Same lockup as the TramiMuniSC site: tile + "Trami" "Muni" "SC"
  tramimunisc: ['Trami', 'Muni', 'SC'],
};

export interface ProjectLogo {
  src: string;
  width: number;
  height: number;
  wordmark?: [string, string, string?];
}

export function getProjectLogo(key: string): ProjectLogo | undefined {
  const file = files[`../assets/logos/${key}.svg`]?.default;
  if (!file) return undefined;
  return { src: file.src, width: file.width, height: file.height, wordmark: wordmarks[key] };
}
