import { describe, expect, it } from 'vitest';
import {
  MAJOR_VERSIONS,
  LATEST_MAJOR,
  LATEST_SEMVER,
  isKnownVersion,
  resolveVersion,
  stripVersionPrefix,
  versionedPath,
} from '../lib/versions';

describe('versions (major-line model)', () => {
  it('exposes LATEST_MAJOR as the first (newest) major line', () => {
    expect(LATEST_MAJOR).toBe(MAJOR_VERSIONS[0]);
  });

  it('every major line is <number>.x shaped', () => {
    expect(MAJOR_VERSIONS.length).toBeGreaterThanOrEqual(1);
    for (const v of MAJOR_VERSIONS) {
      expect(v).toMatch(/^\d+\.x$/);
    }
  });

  it('LATEST_SEMVER is a full semver string', () => {
    expect(LATEST_SEMVER).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('detects known major lines', () => {
    for (const v of MAJOR_VERSIONS) {
      expect(isKnownVersion(v)).toBe(true);
    }
    expect(isKnownVersion('9.x')).toBe(false);
  });

  it('resolves latest when first slug segment is not a version', () => {
    expect(resolveVersion(['quick-start'])).toEqual({
      version: LATEST_MAJOR,
      isLatest: true,
      rest: ['quick-start'],
    });
    expect(resolveVersion(['core-concepts', 'nodes'])).toEqual({
      version: LATEST_MAJOR,
      isLatest: true,
      rest: ['core-concepts', 'nodes'],
    });
  });

  it('resolves an explicit <major>.x segment', () => {
    if (MAJOR_VERSIONS.length >= 2) {
      const older = MAJOR_VERSIONS[MAJOR_VERSIONS.length - 1]; // 最旧的线
      expect(resolveVersion([older, 'quick-start'])).toEqual({
        version: older,
        isLatest: false,
        rest: ['quick-start'],
      });
    }
  });

  it('maps a legacy semver first segment onto its major line', () => {
    // 1.2.1 → 1.x (兼容旧 SEO 链接)
    // 注: 把 LATEST_MAJOR 当 string 比较, 避免在单 major 线时被字面量类型窄化
    // (当只有 1.x 时, MajorVersion = '1.x', '2.x' === LATEST_MAJOR 会被 TS 判为无重叠)
    const latest: string = LATEST_MAJOR;
    expect(resolveVersion(['1.2.1', 'quick-start'])).toEqual({
      version: '1.x',
      isLatest: '1.x' === latest,
      rest: ['quick-start'],
    });
    expect(resolveVersion(['2.0.0', 'quick-start'])).toEqual({
      version: '2.x',
      isLatest: '2.x' === latest,
      rest: ['quick-start'],
    });
  });

  it('strips a version prefix (major-line or legacy semver) if present', () => {
    expect(stripVersionPrefix([LATEST_MAJOR, 'quick-start'])).toEqual(['quick-start']);
    expect(stripVersionPrefix(['1.2.1', 'quick-start'])).toEqual(['quick-start']);
    expect(stripVersionPrefix(['quick-start'])).toEqual(['quick-start']);
  });

  it('builds a versioned path with no prefix for latest major line', () => {
    expect(versionedPath('quick-start', LATEST_MAJOR)).toBe('quick-start');
  });

  it('builds a versioned path with <major>.x/ prefix for old lines', () => {
    if (MAJOR_VERSIONS.length >= 2) {
      const older = MAJOR_VERSIONS[MAJOR_VERSIONS.length - 1];
      expect(versionedPath('quick-start', older)).toBe(`${older}/quick-start`);
    }
  });
});
