import {
  getAgendaFromUser,
  updateAgendaFromUser,
  linkAgendaToUser,
  getAllAgendaIdentifiers
} from './agenda.service';
import { Agenda, Day } from './agenda.entity';
import { toAgendaDto } from './dto/agenda.dto';
import { 
  getAgendaIdByUserId, 
  getAgendaFromId, 
  setAgendaFromId, 
  linkAgendaToUser as repoLinkAgendaToUser, 
  listAgendas 
} from './agenda.repository';

// Mock the repository with a factory
jest.mock('./agenda.repository', () => ({
  getAgendaIdByUserId: jest.fn(),
  getAgendaFromId: jest.fn(),
  setAgendaFromId: jest.fn(),
  linkAgendaToUser: jest.fn(),
  listAgendas: jest.fn(),
}));

const mockGetAgendaIdByUserId = getAgendaIdByUserId as jest.Mock;
const mockGetAgendaFromId = getAgendaFromId as jest.Mock;
const mockSetAgendaFromId = setAgendaFromId as jest.Mock;
const mockLinkAgendaToUser = repoLinkAgendaToUser as jest.Mock;
const mockListAgendas = listAgendas as jest.Mock;

describe('AgendaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAgendaFromUser', () => {
    it('should return agenda dto for user', async () => {
      const mockAgenda = new Agenda();
      mockAgenda.set(Day.MONDAY, 8, 'Math');
      
      mockGetAgendaIdByUserId.mockResolvedValue('agenda-123');
      mockGetAgendaFromId.mockResolvedValue(mockAgenda);

      const result = await getAgendaFromUser({ user: { id: 1 } as any });

      expect(mockGetAgendaIdByUserId).toHaveBeenCalledWith({ userId: 1 });
      expect(mockGetAgendaFromId).toHaveBeenCalledWith('agenda-123');
      expect(result).toEqual(toAgendaDto(mockAgenda));
    });

    it('should throw if agenda not found', async () => {
      mockGetAgendaIdByUserId.mockRejectedValue(new Error('Not found'));
      
      await expect(getAgendaFromUser({ user: { id: 1 } as any })).rejects.toThrow('Not found');
    });
  });

  describe('updateAgendaFromUser', () => {
    it('should update agenda successfully', async () => {
      const mockData = Array(5).fill(null).map(() => Array(10).fill(""));
      const mockAgendaDto = {
        data: mockData
      };

      mockGetAgendaIdByUserId.mockResolvedValue('agenda-123');
      mockSetAgendaFromId.mockResolvedValue(undefined);

      await updateAgendaFromUser({ user: { id: 1 } as any, agenda: mockAgendaDto });

      expect(mockGetAgendaIdByUserId).toHaveBeenCalledWith({ userId: 1 });
      expect(mockSetAgendaFromId).toHaveBeenCalledWith('agenda-123', expect.any(Agenda));
    });
  });

  describe('linkAgendaToUser', () => {
    it('should link agenda and return it', async () => {
      const mockIdentifier = { agenda_id: 'agenda-123', user_id: '1' };
      const mockAgenda = new Agenda();
      
      mockLinkAgendaToUser.mockResolvedValue(mockIdentifier);
      mockGetAgendaFromId.mockResolvedValue(mockAgenda);

      const result = await linkAgendaToUser({ agendaId: 'agenda-123', userId: '1' });

      expect(mockLinkAgendaToUser).toHaveBeenCalledWith({ agendaId: 'agenda-123', userId: '1' });
      expect(mockGetAgendaFromId).toHaveBeenCalledWith('agenda-123');
      expect(result).toBe(mockAgenda);
    });
  });

  describe('getAllAgendaIdentifiers', () => {
    it('should return list of identifiers', async () => {
      const mockList = [{ agenda_id: 'a1', user_id: 'u1' }];
      mockListAgendas.mockResolvedValue(mockList);

      const result = await getAllAgendaIdentifiers();

      expect(mockListAgendas).toHaveBeenCalled();
      expect(result).toEqual(mockList);
    });
  });
});
