/**
 * Module Federation manifest storage
 * Works in both SSR and browser environments
 */

export interface ManifestRemote {
  server: string;
  browser: string;
}

export interface Manifest {
  [remoteName: string]: ManifestRemote;
}

// Module-level storage for the manifest
let manifestCache: Manifest | null = null;
let remotesMap = new Map();

/**
 * Sets the Module Federation manifest
 * @param manifest - The manifest object containing remote configurations
 */
export function setManifest(manifest: Manifest): void {
  manifestCache = manifest;

  Object.keys(manifest).forEach((remoteName) => {
    remotesMap.set(remoteName, {
      name: remoteName,
      entry: manifest[remoteName].browser,
      type: 'module'
    });
  });
}

/**
 * Gets the Module Federation manifest
 * @returns The manifest object or null if not set
 */
export function getManifest(): Manifest | null {
  return manifestCache;
}

export function getRemote(remoteName: string): any {
  if (remotesMap.has(remoteName)) {
    return remotesMap.get(remoteName);
  }

  throw new Error(`Remote ${remoteName} doesn't exist`);
}

/**
 * Checks if the manifest has been set
 * @returns true if manifest is available
 */
export function hasManifest(): boolean {
  return manifestCache !== null;
}

/**
 * Clears the manifest (useful for testing)
 */
export function clearManifest(): void {
  manifestCache = null;
}
