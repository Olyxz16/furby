import {
  getUserFromSessionToken,
  SignIn,
  Login,
  Logout,
  CreateMagicLink,
  ConsumeMagicLink
} from './auth.service';
import * as sessionRepo from './session.repository';
import * as userRepo from '../user/user.repository';
import * as magicLinkRepo from './magic-link.repository';
import bcrypt from 'bcrypt';
import { UserRole } from './role.entity';

// Mock dependencies
jest.mock('./session.repository');
jest.mock('../user/user.repository');
jest.mock('./magic-link.repository');
jest.mock('bcrypt');

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn().mockReturnValue('mocked-uuid')
  }
});

describe('AuthService', () => {
  const mockUser = {
    id: 1,
    mail: 'test@example.com',
    password: 'hashed-password',
    role: UserRole.USER,
    discordUserId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const mockSession = {
    id: 1,
    userId: 1,
    token: 'mocked-token',
    createdAt: new Date().toISOString(),
    expiresAt: new Date().toISOString()
  };

  const mockMagicLink = {
    id: 1,
    userId: 1,
    link: 'mocked-uuid',
    createdAt: new Date().toISOString(),
    expiresAt: new Date().toISOString()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserFromSessionToken', () => {
    it('should return user when session and user exist', async () => {
      (sessionRepo.getSessionByToken as jest.Mock).mockResolvedValue(mockSession);
      (userRepo.getById as jest.Mock).mockResolvedValue(mockUser);

      const result = await getUserFromSessionToken('mocked-token');

      expect(sessionRepo.getSessionByToken).toHaveBeenCalledWith({ token: 'mocked-token' });
      expect(userRepo.getById).toHaveBeenCalledWith({ id: mockSession.userId });
      expect(result).toEqual(mockUser);
    });

    it('should throw error when session does not exist', async () => {
      (sessionRepo.getSessionByToken as jest.Mock).mockResolvedValue(undefined);

      await expect(getUserFromSessionToken('invalid-token')).rejects.toThrow('Could not find session');
    });

    it('should throw error and delete session when user does not exist', async () => {
      (sessionRepo.getSessionByToken as jest.Mock).mockResolvedValue(mockSession);
      (userRepo.getById as jest.Mock).mockResolvedValue(undefined);

      await expect(getUserFromSessionToken('mocked-token')).rejects.toThrow('Could not find user');
      expect(sessionRepo.deleteSessionByToken).toHaveBeenCalledWith({ token: 'mocked-token' });
    });
  });

  describe('SignIn', () => {
    it('should create user and session', async () => {
      const signInInput = { mail: 'test@example.com', password: 'password' };
      (bcrypt.hashSync as jest.Mock).mockReturnValue('hashed-password');
      (userRepo.create as jest.Mock).mockResolvedValue(mockUser);
      (sessionRepo.createSession as jest.Mock).mockResolvedValue(mockSession);

      const result = await SignIn(signInInput);

      expect(bcrypt.hashSync).toHaveBeenCalledWith('password', 10);
      expect(userRepo.create).toHaveBeenCalledWith({
        mail: signInInput.mail,
        password: 'hashed-password',
        role: UserRole.USER,
        discordUserId: null
      });
      expect(sessionRepo.createSession).toHaveBeenCalledWith({
        userId: mockUser.id,
        token: 'mocked-uuid'
      });
      expect(result).toEqual({ user: mockUser, session: mockSession });
    });
  });

  describe('Login', () => {
    it('should return session when credentials are valid', async () => {
      const loginInput = { mail: 'test@example.com', password: 'password' };
      (userRepo.getByMail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
      (sessionRepo.createSession as jest.Mock).mockResolvedValue(mockSession);

      const result = await Login(loginInput);

      expect(userRepo.getByMail).toHaveBeenCalledWith({ mail: loginInput.mail });
      expect(bcrypt.compareSync).toHaveBeenCalledWith(loginInput.password, mockUser.password);
      expect(sessionRepo.createSession).toHaveBeenCalledWith({
        userId: mockUser.id,
        token: 'mocked-uuid'
      });
      expect(result).toEqual(mockSession);
    });

    it('should throw error when user not found', async () => {
      (userRepo.getByMail as jest.Mock).mockResolvedValue(undefined);

      await expect(Login({ mail: 'wrong@example.com', password: 'password' }))
        .rejects.toThrow('Could not find user');
    });

    it('should throw error when password does not match', async () => {
      (userRepo.getByMail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

      await expect(Login({ mail: 'test@example.com', password: 'wrong' }))
        .rejects.toThrow("Passwords don't match");
    });
  });

  describe('Logout', () => {
    it('should delete session', async () => {
      await Logout({ token: 'mocked-token' });
      expect(sessionRepo.deleteSessionByToken).toHaveBeenCalledWith({ token: 'mocked-token' });
    });
  });

  describe('CreateMagicLink', () => {
    it('should create magic link', async () => {
      (magicLinkRepo.createMagicLink as jest.Mock).mockResolvedValue(mockMagicLink);

      const result = await CreateMagicLink({ userId: 1, link: '' }); 

      expect(magicLinkRepo.createMagicLink).toHaveBeenCalledWith({
        userId: 1,
        link: 'mocked-uuid'
      });
      expect(result).toEqual(mockMagicLink);
    });
  });

  describe('ConsumeMagicLink', () => {
    it('should update user discordUserId when valid', async () => {
      const input = { magicLinkCode: 'mocked-uuid', discordUserId: 'discord-123' };
      (magicLinkRepo.getMagicLinkByLink as jest.Mock).mockResolvedValue(mockMagicLink);
      (userRepo.getById as jest.Mock).mockResolvedValue(mockUser);

      await ConsumeMagicLink(input);

      expect(magicLinkRepo.getMagicLinkByLink).toHaveBeenCalledWith({ link: input.magicLinkCode });
      expect(userRepo.getById).toHaveBeenCalledWith({ id: mockMagicLink.userId });
      
      expect(mockUser.discordUserId).toBe('discord-123');
      expect(userRepo.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw error when magic link not found', async () => {
      (magicLinkRepo.getMagicLinkByLink as jest.Mock).mockResolvedValue(undefined);

      await expect(ConsumeMagicLink({ magicLinkCode: 'invalid', discordUserId: '123' }))
        .rejects.toThrow('Could not find magic link');
    });

    it('should throw error when user associated with link not found', async () => {
      (magicLinkRepo.getMagicLinkByLink as jest.Mock).mockResolvedValue(mockMagicLink);
      (userRepo.getById as jest.Mock).mockResolvedValue(undefined);

      await expect(ConsumeMagicLink({ magicLinkCode: 'mocked-uuid', discordUserId: '123' }))
        .rejects.toThrow('Could not find user');
    });
  });
});