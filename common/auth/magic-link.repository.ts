import db from '../config/db';
import { CreateMagicLinkDto, DeleteMagicLinkByLinkDto, GetMagicLinkByLinkDto } from './dto/magic-link.dto';
import { MagicLink, setExpiry } from './magic-link.entity';

export async function createMagicLink(input: CreateMagicLinkDto): Promise<MagicLink> {
  const expiresAt = setExpiry();

   const query = `
    INSERT INTO MagicLinks (user_id, link, expires_at)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, link, created_at, expires_at;
  `;

  const res = await db.query(query, [input.userId, input.link, expiresAt.toISOString()]);
  const row = res.rows[0];

  return {
    id: row.id,
    userId: row.user_id,
    link: row.link,
    createdAt: row.created_at,
    expiresAt: row.expires_at
  };
}

export async function getMagicLinkByLink(input: GetMagicLinkByLinkDto): Promise<MagicLink|undefined> {
  const query = `
    SELECT * FROM MagicLinks WHERE link = $1
  `;

  const res = await db.query(query, [input.link]);
  const row = res.rows[0];
  if (!row) {
    return undefined;
  }

  const expiresAt = new Date(row.expires_at);
  if (expiresAt < new Date()) {
    await deleteMagicLinkByLink(input);
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

export async function deleteMagicLinkByLink(input: DeleteMagicLinkByLinkDto): Promise<void> {
    const query = `
      DELETE FROM MagicLinks WHERE link = $1
    `
    await db.query(query, [input.link]);
}