import dotenv from 'dotenv';
import path from 'path';

// Load env vars from root .env BEFORE importing anything else
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Ensure required env vars are set for Config validation
process.env.DISCORD_TOKEN = process.env.DISCORD_TOKEN || 'mock_token';
process.env.DISCORD_APPLICATION_ID = process.env.DISCORD_APPLICATION_ID || 'mock_app_id';
process.env.DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID || 'mock_guild_id';
process.env.GOOGLE_AUTH_EMAIL = process.env.GOOGLE_AUTH_EMAIL || 'mock@email.com';
process.env.GOOGLE_AUTH_KEY = process.env.GOOGLE_AUTH_KEY || 'mock_key';
process.env.GOOGLE_SHEETS_DOC_ID = process.env.GOOGLE_SHEETS_DOC_ID || 'mock_doc_id';
// Default DB vars if not in .env (though they should be)
process.env.DB_USER = process.env.DB_USER || 'postgres';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'password';
process.env.DB_NAME = process.env.DB_NAME || 'furby';
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_PORT = process.env.DB_PORT || '5432';

// --- MOCKING GOOGLE SPREADSHEET ---
const mockCell = { value: "Test Class" };
const mockEmptyCell = { value: "" };

// Sheet 1: Index Sheet (List of users/agendas)
const mockIndexSheet = {
  loadCells: jest.fn(),
  getCell: jest.fn((row, col) => {
    if (col === 0) return { value: "Test Student" }; // Name
    if (col === 1) return { value: "123456" };       // ID
    return mockEmptyCell;
  }),
  rowCount: 20,
  saveUpdatedCells: jest.fn(),
  title: "Index",
};

// Sheet 2: Agenda Sheet (The actual schedule)
const mockAgendaSheet = {
  loadCells: jest.fn(),
  getCell: jest.fn((row, col) => {
     // Agenda Grid (Rows 1-10, Cols 1-5)
    // Simple pattern: Monday 8am has a class
    if (row === 1 && col === 1) return { value: "Monday 8am Class" };
    return mockEmptyCell;
  }),
  rowCount: 20,
  saveUpdatedCells: jest.fn(),
  title: "123456-Test Student", // Format: ID-Name
};

const mockDoc = {
  loadInfo: jest.fn(),
  sheetsById: {
    [1871304734]: mockIndexSheet 
  },
  sheetsByIndex: [mockIndexSheet, mockAgendaSheet],
  sheetCount: 2
};

jest.mock('google-spreadsheet', () => {
  return {
    GoogleSpreadsheet: jest.fn().mockImplementation(() => mockDoc),
    JWT: jest.fn()
  };
});

// --- IMPORTS ---
import axios from 'axios';
import { randomBytes } from 'crypto';
import { ConsumeMagicLink } from '../../common/auth/auth.service';
import { getAgendaFromDiscordId } from '../../common/user/user.service';
import { linkAgendaToUser } from '../../common/agenda/agenda.repository';

// Config
const API_URL = process.env.API_URL || 'http://localhost:3000';
const API_HOST = process.env.API_HOST || 'furby.olyxz16.fr';

describe('Magic Link & Agenda Flow', () => {
  let cookie: string;
  const email = `test-magic-${randomBytes(4).toString('hex')}@example.com`;
  const password = 'password123';
  const discordId = `discord-${randomBytes(4).toString('hex')}`;
  let magicLinkCode: string;

  console.log(`Test User: ${email}`);
  console.log(`Test Discord ID: ${discordId}`);

  const client = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: API_HOST ? { 'Host': API_HOST } : {}
  });

  // 1. User logs into the API (creates account first if needed, but we use SignIn for new users)
  test('1. Sign In (API)', async () => {
    try {
      const response = await client.post('/auth/signin', {
        mail: email,
        password: password
      });
      expect(response.status).toBe(201);
      
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      if (cookies) {
        const sessionCookie = cookies.find(c => c.startsWith('session='));
        if (sessionCookie) {
            cookie = sessionCookie.split(';')[0];
        } else {
            cookie = cookies[0].split(';')[0];
        }
      }
      expect(cookie).toBeDefined();
    } catch (error: any) {
      console.error("Sign In failed:", error.response?.data || error.message);
      throw error;
    }
  });

  // 2. User creates a magic link through the API
  test('2. Create Magic Link (API)', async () => {
    try {
      const response = await client.post('/auth/magic-link', {}, {
        headers: { Cookie: cookie }
      });
      expect(response.status).toBe(201);
      expect(response.data.link).toBeDefined();
      magicLinkCode = response.data.link;
      console.log("Magic Link Code:", magicLinkCode);
    } catch (error: any) {
      console.error("Create Magic Link failed:", error.response?.data || error.message);
      throw error;
    }
  });

  // 3. Retrieve and Link (Discord Service Mock)
  test('3. Consume Magic Link (Service)', async () => {
    expect(magicLinkCode).toBeDefined();
    
    // Call the service directly, simulating the Discord bot
    await ConsumeMagicLink({
      magicLinkCode: magicLinkCode,
      discordUserId: discordId
    });

    console.log("Magic Link consumed successfully via Service");
  });

  // 4. Retrieve Agenda (Discord Service Mock)
  test('4. Retrieve Agenda (Service)', async () => {
    // Setup: We need to ensure the user has an agenda linked in Postgres.
    // In a real scenario, the user might need to link it via another command, 
    // or the system assigns one. 
    // The `ConsumeMagicLink` only links Discord ID to User.
    // `getAgendaFromUser` calls `getAgendaIdByUserId`.
    // Since our user is new, `getAgendaIdByUserId` will likely fail unless we insert a record.
    // We will cheat slightly and link an agenda manually using the repository, 
    // to simulate that the user has been assigned an agenda (or is a valid student).
    
    // We first need the User ID. Since we don't have it easily from the API response 
    // (SignIn returns UserDto but we need to check if it has ID),
    // let's fetch the user by Discord ID using the service (which we just linked).
    
    // Actually, `getAgendaFromDiscordId` calls `getUserByDiscordId`.
    // So we just need to ensure the `Agendas` table has an entry.
    
    // Let's get the user to find their ID.
    const { getUserByDiscordId } = require('../../common/user/user.repository');
    const user = await getUserByDiscordId({ discordId: discordId });
    expect(user).toBeDefined();

    // Link a fake agenda ID (must match what our Mock Sheet expects: "123456")
    await linkAgendaToUser({
      userId: user.id,
      agendaId: "123456"
    });

    // Now call the target service function
    const agendaDto = await getAgendaFromDiscordId({ discordId: discordId });
    
    expect(agendaDto).toBeDefined();
    expect(agendaDto.data).toBeDefined();
    // Check for the value we mocked
    expect(agendaDto.data[0][0]).toBe("Monday 8am Class"); 
    
    console.log("Agenda retrieved successfully via Service");
  });
});
