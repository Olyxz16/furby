import { CreateSessionDto, DeleteSessionByTokenDto, GetSessionByTokenDto } from "./dto/session.dto";
import { Session, setExpiry } from "./session.entity";
import db from "../config/db";

export function createSession(input: CreateSessionDto): Session {
  const expiresAt = setExpiry();

   const stmt = db.prepare(`
    INSERT INTO Sessions (user_id, token, expires_at)
    VALUES (@userId, @token, @expiresAt)
    RETURNING id, user_id, token, created_at, expires_at;
  `);

  const row = stmt.get({
    userId: input.userId,
    token: input.token,
    expiresAt: expiresAt.toISOString()
  }) as any;

  return {
    id: row.id,
    userId: row.user_id,
    token: row.token,
    createdAt: row.created_at,
    expiresAt: row.expires_at
  };
}

export function getSessionByToken(input: GetSessionByTokenDto): Session|undefined {
  const stmt = db.prepare(`
    SELECT * FROM Sessions WHERE token = ?
  `);

  const row = stmt.get(input.token) as any;
  if (!row) {
    return undefined;
  }

  const expiresAt = new Date(row.expires_at);
  if (expiresAt < new Date()) {
    deleteSessionByToken(input);
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

export function deleteSessionByToken(input: DeleteSessionByTokenDto): void {
    const stmt = db.prepare(`
      DELETE FROM Sessions WHERE token = ?
    `)
    stmt.run(input.token);
}
