import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('OrdersService - Business Logic Unit Tests', () => {
  let service: OrdersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    product: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    coupon: {
      findUnique: jest.fn(),
    },
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should correctly recalculate price server-side and apply percentage coupon discount', async () => {
    mockPrismaService.product.findMany.mockResolvedValue([
      { id: 'p1', name: 'Excel Tax Calculator', price: '499.00', status: 'ACTIVE' },
    ]);

    mockPrismaService.coupon.findUnique.mockResolvedValue({
      id: 'c1',
      code: 'BRIGHT2026',
      status: 'ACTIVE',
      discountType: 'PERCENTAGE',
      discountValue: '10.00',
      minOrderAmount: '200.00',
      expiresAt: new Date(Date.now() + 1000000),
    });

    mockPrismaService.order.create.mockImplementation(({ data }: any) => ({
      id: 'ord-1',
      orderNumber: data.orderNumber,
      subtotal: data.subtotal,
      discountAmount: data.discountAmount,
      total: data.total,
      items: [{ productId: 'p1', price: 499.0, quantity: 1 }],
    }));

    const result = await service.createOrder('user-1', {
      items: [{ productId: 'p1', quantity: 1 }],
      couponCode: 'BRIGHT2026',
      customerEmail: 'test@example.com',
      customerFirstName: 'Abebe',
      customerLastName: 'Bikila',
      paymentProvider: 'CHAPA',
    });

    expect(result.subtotal).toBe(499.0);
    expect(result.discountAmount).toBe(49.9);
    expect(result.totalAmount).toBe(449.1);
  });
});
