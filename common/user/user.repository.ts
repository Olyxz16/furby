import { GetUserByIdDto, GetUserByMailDto, RemoveDiscordIdDto, SetDiscordIdDto, UserCreateDto } from './dto/user.dto';
import { User } from './user.entity';
import db from '../config/db';
import { SqliteError } from 'better-sqlite3';

export function create(user: UserCreateDto): User {
  const stmt = db.prepare(`
    INSERT INTO Users (mail, password, role, discord_user_id) 
    VALUES(@mail, @password, @role, @discordUserId)
    RETURNING id, mail, password, role, discord_user_id, created_at, updated_at;
`);

  try {
    const row = stmt.get(user) as any;

    return {
      id: row.id,
      mail: row.mail,
      password: row.password,
      role: row.role,
      discordUserId: row.discord_user_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  } catch(err) {
    if(err instanceof SqliteError && err.code == 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new Error('User with this email already exists.');
    }
    throw err;
  }
}

export function save(user: User): User {
  const stmt = db.prepare(`
    INSERT INTO Users (id, email, password, role, discord_user_id)
    VALUES (@id, @mail, @password, @role, @discordUserId)
    ON CONFLICT(id) DO UPDATE SET
      mail = excluded.mail,
      password = excluded.password,
      role = excluded.role,
      discord_user_id = excluded.discord_user_id,
      update_id = CURRENT_TIMESTAMP
  `);

  try {
    const row = stmt.get(user) as any;
    
    return {
      id: row.id,
      mail: row.mail,
      password: row.password,
      role: row.role,
      discordUserId: row.discord_user_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  } catch(err) {
    if(err instanceof SqliteError && err.code == 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new Error('User with th is email already exists');
    }
    throw err;
  }
}

export function getById(input: GetUserByIdDto): User|undefined {
  const stmt = db.prepare(`
    SELECT id, mail, password, role, discord_user_id, created_at, updated_at
    FROM Users
    WHERE id = @id;
`);

  const row = stmt.get(input.id) as any;
  if(!row) {
    return undefined;
  }

  return {
    id: row.id,
    mail: row.mail,
    password: row.password,
    role: row.role,
    discordUserId: row.discord_user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function getByMail(input: GetUserByMailDto): User|undefined {
  const stmt = db.prepare(`
    SELECT id, mail, password, role, discord_user_id, created_at, updated_at
    FROM Users
    WHERE id = @id;
`);

  const row = stmt.get(input.mail) as any;
  if(!row) {
    return undefined;
  }

  return {
    id: row.id,
    mail: row.mail,
    password: row.password,
    role: row.role,
    discordUserId: row.discord_user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function setDiscordId(input: SetDiscordIdDto): User {
  const stmt = db.prepare(`
    UPDATE Users 
    SET discord_user_id = ?
    WHERE id = ?
    RETURNING id, mail, password, role, discord_user_id, created_at, updated_at;
  `);

  try {
    const row = stmt.get(input.discordUserId, input.userId) as any;
    if(!row) {
      throw new Error('User not found')
    }
    
    return {
      id: row.id,
      mail: row.mail,
      password: row.password,
      role: row.role,
      discordUserId: row.discord_user_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  } catch(err) {
    if(err instanceof SqliteError && err.code == 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new Error('This discord account is already linked to another user.');
    }
    throw err;
  }
}

export function removeDiscordId(input: RemoveDiscordIdDto): User {
  const stmt = db.prepare(`
    UPDATE Users 
    SET discord_user_id = NULL
    WHERE id = ?
    RETURNING id, mail, password, role, discord_user_id, created_at, updated_at;
  `);

  try {
    const row = stmt.get(input.userId) as any;

    if(!row) {
      throw new Error('User not found');
    }
    
    return {
      id: row.id,
      mail: row.mail,
      password: row.password,
      role: row.role,
      discordUserId: row.discord_user_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  } catch(err) {
    if(err instanceof SqliteError && err.code == 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new Error('User with th is email already exists');
    }
    throw err;
  }
}
