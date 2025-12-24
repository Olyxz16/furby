import db from '../config/db';
import { CreateMagicLinkDto, DeleteMagicLinkByLinkDto, GetMagicLinkByLinkDto } from './dto/magic-link.dto';
import { MagicLink, setExpiry } from './magic-link.entity';

export function createMagicLink(input: CreateMagicLinkDto): MagicLink {
  const expiresAt = setExpiry();

   const stmt = db.prepare(`
    INSERT INTO MagicLinks (user_id, link, expires_at)
    VALUES (@userId, @link, @expiresAt)
    RETURNING id, user_id, link, created_at, expires_at;
  `);

  const row = stmt.get({
    userId: input.userId,
    link: input.link,
    expiresAt: expiresAt.toISOString()
  }) as any;

  return {
    id: row.id,
    userId: row.user_id,
    link: row.link,
    createdAt: row.created_at,
    expiresAt: row.expires_at
  };
}

export function getMagicLinkByLink(input: GetMagicLinkByLinkDto): MagicLink|undefined {
  const stmt = db.prepare(`
    SELECT * FROM MagicLinks WHERE link = ?
  `);

  const row = stmt.get(input.link) as any;
  if (!row) {
    return undefined;
  }

  const expiresAt = new Date(row.expires_at);
  if (expiresAt < new Date()) {
    deleteMagicLinkByLink(input);
    return undefined;
  }

  return {
    id: row.id,
    userId: row.user_id,
    link: row.link,
    createdAt: row.created_at,
    expiresAt: row.expires_at
  };
}

export function deleteMagicLinkByLink(input: DeleteMagicLinkByLinkDto): void {
    const stmt = db.prepare(`
      DELETE FROM MagicLinks WHERE link = ?
    `)
    stmt.run(input.link);
}
