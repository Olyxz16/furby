import { getUserByDiscordIdDto, GetUserByIdDto, GetUserByMailDto, RemoveDiscordIdDto, SetDiscordIdDto, UserCreateDto } from './dto/user.dto';
import { User } from './user.entity';
import db from '../config/db';

export async function create(user: UserCreateDto): Promise<User> {
  const query = `
    INSERT INTO Users (mail, password, role, discord_user_id) 
    VALUES($1, $2, $3, $4)
    RETURNING id, mail, password, role, discord_user_id, created_at, updated_at;
  `;

  try {
    const res = await db.query(query, [user.mail, user.password, user.role, user.discordUserId]);
    const row = res.rows[0];

    return {
      id: row.id,
      mail: row.mail,
      password: row.password,
      role: row.role,
      discordUserId: row.discord_user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  } catch(err: any) {
    if(err.code === '23505') { // unique_violation
      throw new Error('User with this email already exists.');
    }
    throw err;
  }
}

export async function save(user: User): Promise<User> {
  const query = `
    INSERT INTO Users (id, mail, password, role, discord_user_id)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT(id) DO UPDATE SET
      mail = excluded.mail,
      password = excluded.password,
      role = excluded.role,
      discord_user_id = excluded.discord_user_id,
      updated_at = CURRENT_TIMESTAMP
    RETURNING id, mail, password, role, discord_user_id, created_at, updated_at;
  `;

  try {
    const res = await db.query(query, [user.id, user.mail, user.password, user.role, user.discordUserId]);
    const row = res.rows[0];
    
    return {
      id: row.id,
      mail: row.mail,
      password: row.password,
      role: row.role,
      discordUserId: row.discord_user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  } catch(err: any) {
    if(err.code === '23505') {
      throw new Error('User with this email already exists');
    }
    throw err;
  }
}

export async function getById(input: GetUserByIdDto): Promise<User|undefined> {
  const query = `
    SELECT id, mail, password, role, discord_user_id, created_at, updated_at
    FROM Users
    WHERE id = $1;
  `;

  const res = await db.query(query, [input.id]);
  const row = res.rows[0];
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

export async function getByMail(input: GetUserByMailDto): Promise<User|undefined> {
  const query = `
    SELECT id, mail, password, role, discord_user_id, created_at, updated_at
    FROM Users
    WHERE mail = $1;
  `;

  const res = await db.query(query, [input.mail]);
  const row = res.rows[0];
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

export async function getAll(): Promise<Pick<User, 'id' | 'mail'>[]> {
  const query = `
    SELECT id, mail
    FROM Users
    ORDER BY id ASC;
  `;

  const res = await db.query(query, []);
  return res.rows.map((row: any) => ({ id: row.id, mail: row.mail }));
}

export async function setDiscordId(input: SetDiscordIdDto): Promise<User> {
  const query = `
    UPDATE Users 
    SET discord_user_id = $1
    WHERE id = $2
    RETURNING id, mail, password, role, discord_user_id, created_at, updated_at;
  `;

  try {
    const res = await db.query(query, [input.discordUserId, input.userId]);
    const row = res.rows[0];
    if(!row) {
      throw new Error('User not found')
    }
    
    return {
      id: row.id,
      mail: row.mail,
      password: row.password,
      role: row.role,
      discordUserId: row.discord_user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  } catch(err: any) {
    if(err.code === '23505') {
      throw new Error('This discord account is already linked to another user.');
    }
    throw err;
  }
}

export async function getUserByDiscordId(input: getUserByDiscordIdDto): Promise<User> {
  const query = `
    SELECT id, mail, password, role, discord_user_id, created_at, updated_at FROM Users
    WHERE discord_user_id = $1;
  `;

  try {
    const res = await db.query(query, [input.discordId]);
    const row = res.rows[0];
    
    if(!row) {
      throw new Error(`User not found for discord id ${input.discordId}`);
    }

    return {
      id: row.id,
      mail: row.mail,
      password: row.password,
      role: row.role,
      discordUserId: row.discord_user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  } catch(err: any) {
    if(err.code === '23505') {
      throw new Error('User with this id does not exist');
    }
    throw err;
  }
}

export async function removeDiscordId(input: RemoveDiscordIdDto): Promise<User> {
  const query = `
    UPDATE Users 
    SET discord_user_id = NULL
    WHERE id = $1
    RETURNING id, mail, password, role, discord_user_id, created_at, updated_at;
  `;

  try {
    const res = await db.query(query, [input.userId]);
    const row = res.rows[0];

    if(!row) {
      throw new Error('User not found');
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
  } catch(err: any) {
    // Should not happen for setting NULL, but kept for consistency
    if(err.code === '23505') {
      throw new Error('User with this email already exists');
    }
    throw err;
  }
}
