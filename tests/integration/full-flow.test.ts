import axios from 'axios';
import { randomBytes } from 'crypto';

const API_URL = process.env.API_URL || 'http://localhost:3000';
// Default to the ingress host found in infra/base/api/ingress.yaml
const API_HOST = process.env.API_HOST || 'furby.olyxz16.fr';

describe('Full Integration Flow', () => {
  let cookie: string;
  const email = `test-${randomBytes(4).toString('hex')}@example.com`;
  const password = 'password123';

  console.log(`Targeting API at: ${API_URL}`);
  if (API_HOST) {
    console.log(`Using Host header: ${API_HOST}`);
  }
  console.log(`Test User: ${email}`);

  const client = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: API_HOST ? { 'Host': API_HOST } : {}
  });

  test('1. Create Account (Sign In/Up)', async () => {
    try {
      const response = await client.post('/auth/signin', {
        mail: email,
        password: password
      });
      expect(response.status).toBe(201);
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      if (cookies) {
        // Extract the session cookie
        const sessionCookie = cookies.find(c => c.startsWith('session='));
        if (sessionCookie) {
            cookie = sessionCookie.split(';')[0];
        } else {
            cookie = cookies[0].split(';')[0];
        }
      }
    } catch (error: any) {
      console.error("Error creating account:", error.response?.data || error.message);
      throw error;
    }
  });

  test('2. Edit Agenda', async () => {
    const emptyAgenda = Array(5).fill(null).map(() => Array(10).fill(""));
    const newAgenda = JSON.parse(JSON.stringify(emptyAgenda));
    newAgenda[0][0] = "Integration Test Meeting";

    try {
      const response = await client.post('/agendas', {
        agenda: { data: newAgenda }
      }, {
        headers: { Cookie: cookie }
      });
      expect(response.status).toBe(201);
    } catch (error: any) {
      console.error("Error editing agenda:", error.response?.data || error.message);
      throw error;
    }
  });

  test('3. Verify Agenda', async () => {
    try {
      const response = await client.get('/agendas/me', {
        headers: { Cookie: cookie }
      });
      expect(response.status).toBe(200);
      expect(response.data.data).toBeDefined();
      expect(response.data.data[0][0]).toBe("Integration Test Meeting");
    } catch (error: any) {
       console.error("Error verifying agenda:", error.response?.data || error.message);
       throw error;
    }
  });

  test('4. Create Magic Link', async () => {
    try {
      const response = await client.post('/auth/magic-link', {}, {
        headers: { Cookie: cookie }
      });
      expect(response.status).toBe(201);
      expect(response.data.link).toBeDefined();
      console.log("Magic Link Created:", response.data.link);
    } catch (error: any) {
      console.error("Error creating magic link:", error.response?.data || error.message);
      throw error;
    }
  });
});
