export function collectRoutePathsFromTree(_tree?: unknown): string[] {
  return [];
}

export function installPreviewHostBridge(_options?: {
  navigate?: (path: string) => void;
  getRoutePaths?: () => string[];
}): () => void {
  return () => {};
}
