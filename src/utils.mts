export function dirname(path: string): string {
  const match = path.match(/^(.+)\/[^/]+$/);
  if (!match) {
    return ".";
  }
  return match[1];
}

export function getCurrentScriptLocation(): string | undefined {
  const path =
    (document.currentScript as HTMLScriptElement | null)?.src ??
    eval("import.meta\u200b.url");
  if (!path) {
    return undefined;
  }
  return dirname(path);
}
