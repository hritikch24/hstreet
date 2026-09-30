/**
 * Emails the owner when an enquiry arrives, through Resend's HTTP API.
 * Plain fetch, no SDK. If the environment isn't set up, the enquiry is still
 * saved and shown in /hq; only the email is skipped.
 *
 *   RESEND_API_KEY      an API key for a Resend account on this domain
 *   ENQUIRY_EMAIL_TO    where notifications go (the owner)
 *   ENQUIRY_EMAIL_FROM  a verified sender, e.g. enquiries@<this domain>
 */
import { profile } from '@/business/profile';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export async function notifyOwner(subject: string, rows: [string, string | null | undefined][]): Promise<'sent' | 'skipped' | 'failed'> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_EMAIL_TO;
  const from = process.env.ENQUIRY_EMAIL_FROM;
  if (!key || !to || !from) return 'skipped';

  const filled = rows.filter(([, v]) => v);
  const html = `<table style="font-family:system-ui,sans-serif;font-size:15px;border-collapse:collapse">${filled
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#555;vertical-align:top">${esc(k)}</td><td style="padding:4px 0"><strong>${esc(String(v))}</strong></td></tr>`)
    .join('')}</table>`;
  const text = filled.map(([k, v]) => `${k}: ${v}`).join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: `${profile.name} <${from}>`, to: [to], subject, html, text }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok ? 'sent' : 'failed';
  } catch {
    return 'failed';
  }
}
