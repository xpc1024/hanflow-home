// 临时占位; Task 3 重写完整版, Task 5 后由 gen-versions.mjs 生成头部。
export const MAJOR_VERSIONS = ['1.x'] as const;
export type MajorVersion = (typeof MAJOR_VERSIONS)[number];
export const LATEST_MAJOR: MajorVersion = '1.x';
export const LATEST_SEMVER: string = '1.2.1';
