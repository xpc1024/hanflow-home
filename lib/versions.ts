// ⚠️ 此文件由 scripts/gen-versions.mjs 自动生成; 请勿手改。
// 改 content/<major>.x/ 或 package.json 后重跑生成器 (npm run build 的 prebuild 钩子)。

export const MAJOR_VERSIONS = ['1.x'] as const;
export type MajorVersion = (typeof MAJOR_VERSIONS)[number];

export const LATEST_MAJOR: MajorVersion = '1.x';
export const LATEST_SEMVER: string = '1.2.1';


export interface ResolvedVersion {
  version: string;
  isLatest: boolean;
  rest: string[];
}

const MAJOR_LINE_RE = /^\d+\.x$/;      // 大版本线, 如 1.x
const SEMVER_RE = /^\d+\.\d+\.\d+$/;   // 旧完整 semver, 如 1.2.1

export function isKnownVersion(value: string): value is MajorVersion {
  return (MAJOR_VERSIONS as readonly string[]).includes(value);
}

/**
 * 把 docs catch-all slug 拆成 (version, rest):
 *  - 首段是 <major>.x 形态 → 用该大版本线
 *  - 首段是旧 semver (1.2.1) → 归到对应 major 线 <major>.x
 *  - 否则 → LATEST_MAJOR
 * 旧 semver URL 由此兼容, 无需 redirect 配置; locale 在独立 [locale] 段不受影响。
 */
export function resolveVersion(slug: string[]): ResolvedVersion {
  if (slug.length > 0) {
    const first = slug[0];
    if (MAJOR_LINE_RE.test(first)) {
      return { version: first, isLatest: first === LATEST_MAJOR, rest: slug.slice(1) };
    }
    if (SEMVER_RE.test(first)) {
      // 旧 semver 首段 → 归到对应 major 线 (如 1.2.1 → 1.x)
      const majorLine = first.split('.')[0] + '.x';
      return { version: majorLine, isLatest: majorLine === LATEST_MAJOR, rest: slug.slice(1) };
    }
  }
  return { version: LATEST_MAJOR, isLatest: true, rest: slug };
}

export function stripVersionPrefix(slug: string[]): string[] {
  if (slug.length === 0) return slug;
  const first = slug[0];
  if (MAJOR_LINE_RE.test(first) || SEMVER_RE.test(first)) return slug.slice(1);
  return slug;
}

/** 构造文档路径段; LATEST 线不加前缀, 其余线加 <major>.x/ 前缀。 */
export function versionedPath(rest: string, version: string): string {
  return version === LATEST_MAJOR ? rest : `${version}/${rest}`; // 在 String.raw 模板内, 裸反引号会终止模板; 故用 `...` 注入字面量反引号 + 模板表达式, 生成结果见本行表达式
}
