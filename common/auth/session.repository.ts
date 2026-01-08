import { CreateSessionDto, DeleteSessionByTokenDto, GetSessionByTokenDto } from "./dto/session.dto";
import { Session, setExpiry } from "./session.entity";
import db from "../config/db";

export async function createSession(input: CreateSessionDto): Promise<Session> {
  const expiresAt = setExpiry();

   const query = `
    INSERT INTO Sessions (user_id, token, expires_at)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, token, created_at, expires_at;
  `;

  const res = await db.query(query, [input.userId, input.token, expiresAt.toISOString()]);
  const row = res.rows[0];

  return {
    id: row.id,
    userId: row.user_id,
    token: row.token,
    createdAt: row.created_at,
    expiresAt: row.expires_at
  };
}

export async function getSessionByToken(input: GetSessionByTokenDto): Promise<Session|undefined> {
  const query = `
    SELECT * FROM Sessions WHERE token = $1
  `;

  const res = await db.query(query, [input.token]);
  const row = res.rows[0];
  if (!row) {
    return undefined;
  }

  const expiresAt = new Date(row.expires_at);
  if (expiresAt < new Date()) {
    await deleteSessionByToken(input);
    return undefined;
  }

  return {
    id: row.id,
    userId: row.user_id,
    token: row.token,
    createdAt: row.created_at,
    expiresAt: row.expires_at
  };
}

export async function deleteSessionByToken(input: DeleteSessionByTokenDto): Promise<void> {
    const query = `
      DELETE FROM Sessions WHERE token = $1
    `
    await db.query(query, [input.token]);
}