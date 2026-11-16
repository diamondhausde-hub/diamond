/**
 * The GitHub Pages project site is served under /diamond.
 * Keep this value in sync with `basePath` in next.config.ts.
 */
export const BASE_PATH = "/diamond";

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
