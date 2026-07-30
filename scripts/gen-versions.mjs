// scripts/gen-versions.mjs
// 生成 lib/versions.ts (字面量 +, 在 Task 3 起, 辅助函数也由本脚本产出)。
// 扫描 content/ 下 <major>.x 目录 + 读 package.json version。
// ⚠️ lib/versions.ts 是本脚本的生成产物; 不要手改。
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = join(root, 'content');
const outPath = join(root, 'lib', 'versions.ts');

// 1. 扫描 content/ 下 <major>.x 目录 (如 1.x, 2.x), 按 major 数值降序
const majorLineRe = /^(\d+)\.x$/;
let majors = [];
if (existsSync(contentDir)) {
  majors = readdirSync(contentDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && majorLineRe.test(e.name))
    .map((e) => ({ name: e.name, major: Number(e.name.match(majorLineRe)[1]) }))
    .sort((a, b) => b.major - a.major) // 降序: 最新线在前
    .map((e) => e.name);
}
if (majors.length === 0) {
  console.error('[gen-versions] ERROR: no content/<major>.x/ directories found under', contentDir);
  process.exit(1);
}
const latestMajor = majors[0];

// 2. 读 package.json version 作为精确发布号 (页脚/正文用)
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const latestSemver = pkg.version;
if (!latestSemver) {
  console.error('[gen-versions] ERROR: package.json has no version field');
  process.exit(1);
}

// 3. 写 lib/versions.ts 字面量部分 (Task 3 会在 header 后追加 resolveVersion 等辅助函数源码)
const header = `// ⚠️ 此文件由 scripts/gen-versions.mjs 自动生成; 请勿手改。
// 改 content/<major>.x/ 或 package.json 后重跑生成器 (npm run build 的 prebuild 钩子)。

export const MAJOR_VERSIONS = [${majors.map((m) => `'${m}'`).join(', ')}] as const;
export type MajorVersion = (typeof MAJOR_VERSIONS)[number];

export const LATEST_MAJOR: MajorVersion = '${latestMajor}';
export const LATEST_SEMVER: string = '${latestSemver}';
`;

writeFileSync(outPath, header, 'utf8');
console.log(`[gen-versions] wrote lib/versions.ts: MAJOR_VERSIONS=[${majors.join(', ')}] LATEST_MAJOR='${latestMajor}' LATEST_SEMVER='${latestSemver}'`);
