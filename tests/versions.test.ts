import { describe, expect, it } from 'vitest';
import {
  VERSIONS,
  LATEST_VERSION,
  isKnownVersion,
  resolveVersion,
  stripVersionPrefix,
  versionedPath,
} from '../lib/versions';

describe('versions', () => {
  it('exposes the latest version as 1.2.0 (matches hanflow source)', () => {
    expect(LATEST_VERSION).toBe('1.2.0');
    expect(VERSIONS[VERSIONS.length - 1]).toBe(LATEST_VERSION);
  });

  it('tracks the full version history oldest-first', () => {
    // 旧 → 新顺序; LATEST 在末尾。新增版本时这里同步加。
    expect(VERSIONS).toEqual(['1.0.1', '1.1.0', '1.2.0']);
  });

  it('detects known version strings', () => {
    expect(isKnownVersion('1.0.1')).toBe(true);
    expect(isKnownVersion('1.1.0')).toBe(true);
    expect(isKnownVersion('1.2.0')).toBe(true);
    expect(isKnownVersion('9.9.9')).toBe(false);
  });

  it('treats older registered versions as not-latest', () => {
    // 1.0.1 与 1.1.0 仍在 VERSIONS 但不是 LATEST
    expect(isKnownVersion('1.0.1')).toBe(true);
    expect(resolveVersion(['1.0.1', 'quick-start']).isLatest).toBe(false);
    expect(resolveVersion(['1.1.0', 'quick-start']).isLatest).toBe(false);
    expect(resolveVersion(['1.2.0', 'quick-start']).isLatest).toBe(true);
  });

  it('resolves latest when first slug segment is not a version', () => {
    expect(resolveVersion(['quick-start'])).toEqual({
      version: '1.2.0',
      isLatest: true,
      rest: ['quick-start'],
    });
    expect(resolveVersion(['core-concepts', 'nodes'])).toEqual({
      version: '1.2.0',
      isLatest: true,
      rest: ['core-concepts', 'nodes'],
    });
  });

  it('resolves old version when first slug segment is a known version', () => {
    expect(resolveVersion(['1.0.1', 'quick-start'])).toEqual({
      version: '1.0.1',
      isLatest: false,
      rest: ['quick-start'],
    });
  });

  it('resolves unknown semver as a (non-latest) version anyway', () => {
    // SEMVER_RE 只校验形状, 不要求在 VERSIONS 里
    expect(resolveVersion(['0.0.9', 'quick-start'])).toEqual({
      version: '0.0.9',
      isLatest: false,
      rest: ['quick-start'],
    });
  });

  it('strips a version prefix if present, else returns slug unchanged', () => {
    expect(stripVersionPrefix(['1.2.0', 'quick-start'])).toEqual(['quick-start']);
    expect(stripVersionPrefix(['1.0.1', 'quick-start'])).toEqual(['quick-start']);
    expect(stripVersionPrefix(['quick-start'])).toEqual(['quick-start']);
  });

  it('builds a versioned path with no prefix for latest', () => {
    expect(versionedPath('quick-start', '1.2.0')).toBe('quick-start');
  });

  it('builds a versioned path with prefix for old versions', () => {
    expect(versionedPath('quick-start', '1.0.1')).toBe('1.0.1/quick-start');
    expect(versionedPath('quick-start', '1.1.0')).toBe('1.1.0/quick-start');
    expect(versionedPath('quick-start', '0.0.9')).toBe('0.0.9/quick-start');
  });
});
