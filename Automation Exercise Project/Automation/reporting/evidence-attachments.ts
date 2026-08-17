import { relative, resolve } from 'node:path';

type ReporterAttachment = {
  name: string;
  path?: string;
  contentType: string;
};

export type EvidenceAttachment = {
  name: string;
  path: string;
  contentType: string;
  href: string;
};

export function collectEvidenceAttachments(
  attachments: ReporterAttachment[],
  reportDir: string,
  canonicalEvidence?: ReporterAttachment
): EvidenceAttachment[] {
  const screenshotAttachments = attachments.filter(
    (attachment) => attachment.path && attachment.contentType === 'image/png'
  );
  const namedEvidence = screenshotAttachments.filter(
    (attachment) => !['screenshot', 'browser evidence'].includes(attachment.name)
  );
  const candidates = namedEvidence.length
    ? namedEvidence
    : canonicalEvidence
      ? [canonicalEvidence]
      : screenshotAttachments;
  const seen = new Set<string>();

  return candidates.flatMap((attachment) => {
    if (!attachment.path || attachment.contentType !== 'image/png') return [];

    const absolutePath = resolve(attachment.path);
    if (seen.has(absolutePath)) return [];
    seen.add(absolutePath);

    return [
      {
        name: attachment.name,
        path: absolutePath,
        contentType: attachment.contentType,
        href: encodeURI(relative(reportDir, absolutePath).replace(/\\/g, '/')),
      },
    ];
  });
}
