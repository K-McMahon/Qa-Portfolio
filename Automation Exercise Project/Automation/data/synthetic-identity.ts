import { randomBytes } from 'node:crypto';

export function createSyntheticIdentity(
  label: string,
  environment: NodeJS.ProcessEnv = process.env
) {
  const safeLabel = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'test';
  const uniqueId = [
    environment.GITHUB_RUN_ID || 'local',
    environment.GITHUB_RUN_ATTEMPT || '1',
    environment.TEST_WORKER_INDEX || String(process.pid),
    Date.now().toString(36),
    randomBytes(4).toString('hex'),
  ].join('-').toLowerCase();
  return { uniqueId, email: `qa-${safeLabel}-${uniqueId}@example.com` };
}
