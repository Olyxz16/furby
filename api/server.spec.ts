import request from 'supertest';
import { app } from './server';
import * as AuthService from '@/auth/auth.service';

// Mock the entire AuthService module
jest.mock('@/auth/auth.service');
// Mock agenda controller to avoid loading google-spreadsheet (ESM) which causes issues in jest
jest.mock('@/agenda/agenda.controller', () => {
  const router = require('express').Router();
  router.get('/me', (req: any, res: any) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    res.json({ status: 'ok', user: req.user });
  });
  return { agendaRouter: router };
});

describe('API Server Integration Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Protected Routes', () => {
    it('should allow access to /agendas/me with valid session', async () => {
      const mockUser = { id: 1, mail: 'test@test.com' };
      (AuthService.getUserFromSessionToken as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/agendas/me')
        .set('Cookie', ['session=valid-token']);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok', user: mockUser });
    });

    it('should deny access to /agendas/me without session', async () => {
      const response = await request(app)
        .get('/agendas/me');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully and set cookie', async () => {
      const mockSession = { 
        token: 'mock-session-token', 
        userId: 1, 
        createdAt: new Date() 
      };
      
      // We cast to any because the mock implementation might not perfectly match the entity class structure 
      // but it's enough for the controller usage.
      (AuthService.Login as jest.Mock).mockResolvedValue(mockSession);

      const response = await request(app)
        .post('/auth/login')
        .send({ mail: 'test@example.com', password: 'password' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
      // Express default cookie format
      expect(response.header['set-cookie'][0]).toMatch(/session=mock-session-token/);
    });

    it('should return 500 on login failure', async () => {
      (AuthService.Login as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

      const response = await request(app)
        .post('/auth/login')
        .send({ mail: 'wrong@example.com', password: 'wrong' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('POST /auth/signin', () => {
    it('should sign in successfully', async () => {
      const mockUser = { id: 1, mail: 'new@example.com', role: 'user' };
      const mockSession = { token: 'new-token', userId: 1 };
      
      (AuthService.SignIn as jest.Mock).mockResolvedValue({
        user: mockUser,
        session: mockSession
      });

      const response = await request(app)
        .post('/auth/signin')
        .send({ mail: 'new@example.com', password: 'password' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('mail', 'new@example.com');
      expect(response.header['set-cookie'][0]).toMatch(/session=new-token/);
    });
  });
});
