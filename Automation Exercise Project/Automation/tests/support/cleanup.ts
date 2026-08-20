export const CLEANUP_WARNING =
  'Warning: Disposable account cleanup could not be confirmed. Review the test environment manually.';

export async function cleanupWithWarning(
  cleanup: () => Promise<unknown>,
  warn: (message: string) => void = console.warn
) {
  try {
    await cleanup();
    return true;
  } catch {
    warn(CLEANUP_WARNING);
    return false;
  }
}
