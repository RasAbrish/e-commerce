import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
    verify: jest.fn().mockReturnValue({ sub: 'user-1', email: 'test@example.com', role: 'CUSTOMER' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sanitizeUser', () => {
    it('should strip passwordHash and refreshToken from user object', () => {
      const inputUser = {
        id: 'u1',
        email: 'test@example.com',
        passwordHash: 'secret-hash',
        refreshToken: 'refresh-hash',
        firstName: 'Abebe',
        lastName: 'Bikila',
      };

      const result = service.sanitizeUser(inputUser);

      expect(result).toEqual({
        id: 'u1',
        email: 'test@example.com',
        firstName: 'Abebe',
        lastName: 'Bikila',
      });
      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('refreshToken');
    });
  });
});
