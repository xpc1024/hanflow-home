// Single source of truth for doc versions. Latest has no URL prefix; older
// versions get a "<version>/" prefix. Add a new version by appending here and
// creating content/<version>/. Currently tracks the real hanflow version.

export const VERSIONS = ['1.0.1', '1.1.0', '1.2.0', '1.2.1'] as const;
export type Version = (typeof VERSIONS)[number];

export const LATEST_VERSION: Version = '1.2.1';

export function isKnownVersion(value: string): value is Version {
  return (VERSIONS as readonly string[]).includes(value);
}

export interface ResolvedVersion {
  version: string;
  isLatest: boolean;
  rest: string[];
}

const SEMVER_RE = /^\d+\.\d+\.\d+$/;

/**
 * Split a docs catch-all slug into (version, rest). Design spec 6:
 * if the first segment is a version-shaped (semver) string, it is a version path;
 * otherwise the whole slug belongs to the latest version.
 */
export function resolveVersion(slug: string[]): ResolvedVersion {
  if (slug.length > 0 && SEMVER_RE.test(slug[0])) {
    return { version: slug[0], isLatest: slug[0] === LATEST_VERSION, rest: slug.slice(1) };
  }
  return { version: LATEST_VERSION, isLatest: true, rest: slug };
}

export function stripVersionPrefix(slug: string[]): string[] {
  return slug.length > 0 && SEMVER_RE.test(slug[0]) ? slug.slice(1) : slug;
}

/** Build the docs path segment for a doc, prefixing old versions. */
export function versionedPath(rest: string, version: string): string {
  return version === LATEST_VERSION ? rest : `${version}/${rest}`;
}
