import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** Résumé buttons only render once `public/resume.pdf` exists, so the site never links to a missing file. */
export const RESUME_PATH = '/resume.pdf';
export const HAS_RESUME = existsSync(join(process.cwd(), 'public', 'resume.pdf'));
