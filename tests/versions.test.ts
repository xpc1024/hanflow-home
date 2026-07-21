import { describe, expect, it } from 'vitest';
import {
  VERSIONS,
  LATEST_VERSION,
  isKnownVersion,
  resolveVersion,
  stripVersionPrefix,
  versionedPath,
} from '../lib/versions';

// 不硬编码 LATEST 字符串, 而是从 lib/versions.ts 取常量引用。这样 site-sync.sh
// 只改 lib/versions.ts, test 自动跟随, 不需要同步改 test 文件。
// (cycle 2026-W30-1.1.1: 之前硬编码 '1.0.1'/'1.2.0' 导致 site-sync.sh 必须同步改 test)

describe('versions', () => {
  it('exposes the latest version (matches hanflow source)', () => {
    // 不假设具体版本号; 只验证 LATEST 是 VERSIONS 的最后一个
    expect(LATEST_VERSION).toBe(VERSIONS[VERSIONS.length - 1]);
  });

  it('tracks the full version history oldest-first', () => {
    // VERSIONS 应是旧 → 新顺序; 至少有 1 个版本
    expect(VERSIONS.length).toBeGreaterThanOrEqual(1);
    for (const v of VERSIONS) {
      expect(v).toMatch(/^\d+\.\d+\.\d+$/);
    }
  });

  it('detects known version strings', () => {
    for (const v of VERSIONS) {
      expect(isKnownVersion(v)).toBe(true);
    }
    expect(isKnownVersion('9.9.9')).toBe(false);
  });

  it('treats non-LATEST registered versions as not-latest', () => {
    // 任何在 VERSIONS 里但不是 LATEST 的版本, resolveVersion 应判 isLatest=false
    for (const v of VERSIONS) {
      const result = resolveVersion([v, 'quick-start']);
      expect(result.version).toBe(v);
      expect(result.isLatest).toBe(v === LATEST_VERSION);
    }
  });

  it('resolves latest when first slug segment is not a version', () => {
    expect(resolveVersion(['quick-start'])).toEqual({
      version: LATEST_VERSION,
      isLatest: true,
      rest: ['quick-start'],
    });
    expect(resolveVersion(['core-concepts', 'nodes'])).toEqual({
      version: LATEST_VERSION,
      isLatest: true,
      rest: ['core-concepts', 'nodes'],
    });
  });

  it('resolves a known registered old version explicitly', () => {
    // 取 LATEST 之前的第一个版本 (如果有), 作为明确的"旧版本"测试
    if (VERSIONS.length >= 2) {
      const older = VERSIONS[0]; // 最旧的
      expect(resolveVersion([older, 'quick-start'])).toEqual({
        version: older,
        isLatest: false,
        rest: ['quick-start'],
      });
    }
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
    expect(stripVersionPrefix([LATEST_VERSION, 'quick-start'])).toEqual(['quick-start']);
    if (VERSIONS.length >= 2) {
      expect(stripVersionPrefix([VERSIONS[0], 'quick-start'])).toEqual(['quick-start']);
    }
    expect(stripVersionPrefix(['quick-start'])).toEqual(['quick-start']);
  });

  it('builds a versioned path with no prefix for latest', () => {
    expect(versionedPath('quick-start', LATEST_VERSION)).toBe('quick-start');
  });

  it('builds a versioned path with prefix for old versions', () => {
    if (VERSIONS.length >= 2) {
      const older = VERSIONS[0];
      expect(versionedPath('quick-start', older)).toBe(`${older}/quick-start`);
    }
    // 未知 semver 也加前缀
    expect(versionedPath('quick-start', '0.0.9')).toBe('0.0.9/quick-start');
  });
});
