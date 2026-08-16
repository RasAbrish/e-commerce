import { Test, TestingModule } from '@nestjs/testing';
import { DownloadsService } from './downloads.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('DownloadsService - Expiring Download Tokens Unit Tests', () => {
  let service: DownloadsService;

  const mockPrismaService = {
    order: {
      findFirst: jest.fn(),
    },
    productFile: {
      findUnique: jest.fn(),
    },
    downloadToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    downloadLog: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DownloadsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<DownloadsService>(DownloadsService);
  });

  it('should generate a 72-hour expiring token for valid paid order', async () => {
    mockPrismaService.order.findFirst.mockResolvedValue({ id: 'ord-1' });
    mockPrismaService.productFile.findUnique.mockResolvedValue({ id: 'f-1', isActive: true });
    mockPrismaService.downloadToken.create.mockResolvedValue({
      token: 'random-token-xyz',
      expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
    });

    const result = await service.generateToken('user-1', 'f-1', 'ord-1');
    expect(result.token).toBe('random-token-xyz');
    expect(result.downloadUrl).toContain('random-token-xyz');
  });

  it('should throw BadRequestException if download token has expired', async () => {
    mockPrismaService.downloadToken.findUnique.mockResolvedValue({
      id: 'dt-1',
      token: 'expired-token',
      expiresAt: new Date(Date.now() - 10000), // Expired in the past
      useCount: 0,
      maxUses: 5,
    });

    await expect(
      service.validateAndGetFile('expired-token', '127.0.0.1', 'Mozilla')
    ).rejects.toThrow(BadRequestException);
  });
});
