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
    it('should return user when session and user exist', () => {
      (sessionRepo.getSessionByToken as jest.Mock).mockReturnValue(mockSession);
      (userRepo.getById as jest.Mock).mockReturnValue(mockUser);

      const result = getUserFromSessionToken('mocked-token');

      expect(sessionRepo.getSessionByToken).toHaveBeenCalledWith({ token: 'mocked-token' });
      expect(userRepo.getById).toHaveBeenCalledWith({ id: mockSession.userId });
      expect(result).toEqual(mockUser);
    });

    it('should throw error when session does not exist', () => {
      (sessionRepo.getSessionByToken as jest.Mock).mockReturnValue(undefined);

      expect(() => getUserFromSessionToken('invalid-token')).toThrow('Could not find session');
    });

    it('should throw error and delete session when user does not exist', () => {
      (sessionRepo.getSessionByToken as jest.Mock).mockReturnValue(mockSession);
      (userRepo.getById as jest.Mock).mockReturnValue(undefined);

      expect(() => getUserFromSessionToken('mocked-token')).toThrow('Could not find user');
      expect(sessionRepo.deleteSessionByToken).toHaveBeenCalledWith({ token: 'mocked-token' });
    });
  });

  describe('SignIn', () => {
    it('should create user and session', () => {
      const signInInput = { mail: 'test@example.com', password: 'password' };
      (bcrypt.hashSync as jest.Mock).mockReturnValue('hashed-password');
      (userRepo.create as jest.Mock).mockReturnValue(mockUser);
      (sessionRepo.createSession as jest.Mock).mockReturnValue(mockSession);

      const result = SignIn(signInInput);

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
    it('should return session when credentials are valid', () => {
      const loginInput = { mail: 'test@example.com', password: 'password' };
      (userRepo.getByMail as jest.Mock).mockReturnValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
      (sessionRepo.createSession as jest.Mock).mockReturnValue(mockSession);

      const result = Login(loginInput);

      expect(userRepo.getByMail).toHaveBeenCalledWith({ mail: loginInput.mail });
      expect(bcrypt.compareSync).toHaveBeenCalledWith(loginInput.password, mockUser.password);
      expect(sessionRepo.createSession).toHaveBeenCalledWith({
        userId: mockUser.id,
        token: 'mocked-uuid'
      });
      expect(result).toEqual(mockSession);
    });

    it('should throw error when user not found', () => {
      (userRepo.getByMail as jest.Mock).mockReturnValue(undefined);

      expect(() => Login({ mail: 'wrong@example.com', password: 'password' }))
        .toThrow('Could not find user');
    });

    it('should throw error when password does not match', () => {
      (userRepo.getByMail as jest.Mock).mockReturnValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

      expect(() => Login({ mail: 'test@example.com', password: 'wrong' }))
        .toThrow("Passwords don't match");
    });
  });

  describe('Logout', () => {
    it('should delete session', () => {
      Logout({ token: 'mocked-token' });
      expect(sessionRepo.deleteSessionByToken).toHaveBeenCalledWith({ token: 'mocked-token' });
    });
  });

  describe('CreateMagicLink', () => {
    it('should create magic link', () => {
      (magicLinkRepo.createMagicLink as jest.Mock).mockReturnValue(mockMagicLink);

      const result = CreateMagicLink({ userId: 1, link: '' }); // link input is ignored in service logic as it generates UUID

      expect(magicLinkRepo.createMagicLink).toHaveBeenCalledWith({
        userId: 1,
        link: 'mocked-uuid'
      });
      expect(result).toEqual(mockMagicLink);
    });
  });

  describe('ConsumeMagicLink', () => {
    it('should update user discordUserId when valid', () => {
      const input = { magicLinkCode: 'mocked-uuid', discordUserId: 'discord-123' };
      (magicLinkRepo.getMagicLinkByLink as jest.Mock).mockReturnValue(mockMagicLink);
      (userRepo.getById as jest.Mock).mockReturnValue(mockUser);

      ConsumeMagicLink(input);

      expect(magicLinkRepo.getMagicLinkByLink).toHaveBeenCalledWith({ link: input.magicLinkCode });
      expect(userRepo.getById).toHaveBeenCalledWith({ id: mockMagicLink.userId });
      
      // Check if user object was modified and saved
      expect(mockUser.discordUserId).toBe('discord-123');
      expect(userRepo.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw error when magic link not found', () => {
      (magicLinkRepo.getMagicLinkByLink as jest.Mock).mockReturnValue(undefined);

      expect(() => ConsumeMagicLink({ magicLinkCode: 'invalid', discordUserId: '123' }))
        .toThrow('Could not find magic link');
    });

    it('should throw error when user associated with link not found', () => {
      (magicLinkRepo.getMagicLinkByLink as jest.Mock).mockReturnValue(mockMagicLink);
      (userRepo.getById as jest.Mock).mockReturnValue(undefined);

      expect(() => ConsumeMagicLink({ magicLinkCode: 'mocked-uuid', discordUserId: '123' }))
        .toThrow('Could not find user');
    });
  });
});
