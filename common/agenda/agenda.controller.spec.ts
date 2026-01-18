import request from 'supertest';
import express from 'express';
import { agendaRouter } from './agenda.controller';
import { getAllAgendaIdentifiers, linkAgendaToUser } from './agenda.service';

// Mock the service with factory to prevent loading original file
jest.mock('./agenda.service', () => ({
  getAllAgendaIdentifiers: jest.fn(),
  linkAgendaToUser: jest.fn(),
  getAgendaFromUser: jest.fn(),
  updateAgendaFromUser: jest.fn(),
}));

// Mock dto helper if needed
jest.mock('./dto/agenda.dto', () => {
  const originalModule = jest.requireActual('./dto/agenda.dto');
  return {
    ...originalModule,
    toAgendaDto: jest.fn((agenda) => ({ data: [['mocked']] })), // Simple mock
  };
});

const app = express();
app.use(express.json());

// Middleware to mock authentication
app.use((req: any, res, next) => {
  // Allow tests to set user via headers or default
  if (req.headers['x-mock-user']) {
     req.user = JSON.parse(req.headers['x-mock-user'] as string);
  } else {
     req.user = { id: 1, mail: 'test@example.com', role: 'user' };
  }
  next();
});

app.use('/', agendaRouter);

describe('AgendaController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return all agenda identifiers', async () => {
      const mockIdentifiers = [{ agenda_id: 'a1', user_id: 'u1' }];
      (getAllAgendaIdentifiers as jest.Mock).mockResolvedValue(mockIdentifiers);

      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockIdentifiers);
    });

    it('should return 500 on error', async () => {
      (getAllAgendaIdentifiers as jest.Mock).mockRejectedValue(new Error('Fail'));

      const response = await request(app).get('/');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('POST /link', () => {
    it('should link agenda and return dto', async () => {
      // Service returns Agenda entity
      // Controller calls toAgendaDto(agenda)
      const mockAgenda = { some: 'agenda' };
      (linkAgendaToUser as jest.Mock).mockResolvedValue(mockAgenda);

      const response = await request(app)
        .post('/link')
        .send({ agendaId: 'new-agenda-id' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: [['mocked']] });
      expect(linkAgendaToUser).toHaveBeenCalledWith({ 
        agendaId: 'new-agenda-id', 
        userId: '1' 
      });
    });

    it('should return 400 on error', async () => {
      (linkAgendaToUser as jest.Mock).mockRejectedValue(new Error('Fail'));

      const response = await request(app)
        .post('/link')
        .send({ agendaId: 'bad-id' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid agenda id' });
    });

    it('should return 401 if not authenticated', async () => {
      // Override middleware for this test to not set user
      const unauthApp = express();
      unauthApp.use(express.json());
      unauthApp.use('/', agendaRouter);

      const response = await request(unauthApp)
        .post('/link')
        .send({ agendaId: 'id' });

      expect(response.status).toBe(401);
    });
  });
});
