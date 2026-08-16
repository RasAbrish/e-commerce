import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class DownloadsService {
  constructor(private prisma: PrismaService) {}

  async generateToken(userId: string, fileId: string, orderId: string) {
    // Verify user owns paid order containing product with this file
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
        status: 'PAID',
        items: {
          some: {
            product: {
              files: {
                some: { id: fileId },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new ForbiddenException('You have not purchased this digital file or order is not paid');
    }

    const file = await this.prisma.productFile.findUnique({
      where: { id: fileId },
    });

    if (!file || !file.isActive) {
      throw new NotFoundException('Digital file unavailable');
    }

    const tokenString = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 72); // Valid 72 hours

    const downloadToken = await this.prisma.downloadToken.create({
      data: {
        token: tokenString,
        userId,
        fileId,
        orderId,
        expiresAt,
        maxUses: 5,
      },
    });

    return {
      token: downloadToken.token,
      expiresAt: downloadToken.expiresAt,
      downloadUrl: `/api/downloads/file/${downloadToken.token}`,
    };
  }

  async validateAndGetFile(tokenString: string, ipAddress: string, userAgent: string) {
    const downloadToken = await this.prisma.downloadToken.findUnique({
      where: { token: tokenString },
    });

    if (!downloadToken) {
      throw new NotFoundException('Invalid download link');
    }

    if (new Date() > downloadToken.expiresAt) {
      throw new BadRequestException('Download link has expired (72h limit)');
    }

    if (downloadToken.useCount >= downloadToken.maxUses) {
      throw new BadRequestException('Maximum download attempts exceeded');
    }

    const file = await this.prisma.productFile.findUnique({
      where: { id: downloadToken.fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Increment download count and log
    await Promise.all([
      this.prisma.downloadToken.update({
        where: { id: downloadToken.id },
        data: {
          useCount: { increment: 1 },
          usedAt: new Date(),
        },
      }),
      this.prisma.downloadLog.create({
        data: {
          userId: downloadToken.userId,
          fileId: file.id,
          ipAddress: ipAddress || '127.0.0.1',
          userAgent: userAgent || 'Unknown',
        },
      }),
    ]);

    return file;
  }

  async getUserPurchasedFiles(userId: string) {
    const paidOrders = await this.prisma.order.findMany({
      where: {
        userId,
        status: 'PAID',
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                files: true,
                images: { where: { isPrimary: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const filesMap = new Map();

    for (const order of paidOrders) {
      for (const item of order.items) {
        for (const file of item.product.files) {
          if (!filesMap.has(file.id)) {
            filesMap.set(file.id, {
              fileId: file.id,
              fileName: file.fileName,
              fileSize: file.fileSize,
              mimeType: file.mimeType,
              productName: item.product.name,
              productSlug: item.product.slug,
              productImage: item.product.images[0]?.url,
              orderId: order.id,
              orderNumber: order.orderNumber,
              purchasedAt: order.createdAt,
            });
          }
        }
      }
    }

    return Array.from(filesMap.values());
  }
}
