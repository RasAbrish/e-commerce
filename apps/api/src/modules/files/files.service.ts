import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

export interface UploadedFilePayload {
  originalname: string;
  buffer: Buffer;
  size: number;
  mimetype: string;
}

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async handleProductImageUpload(productId: string, file: UploadedFilePayload) {
    if (!file) {
      throw new BadRequestException('No image file uploaded');
    }

    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'products', productId, 'images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer || Buffer.from(''));

    const publicUrl = `/uploads/products/${productId}/images/${fileName}`;

    const existingCount = await this.prisma.productImage.count({ where: { productId } });

    const productImage = await this.prisma.productImage.create({
      data: {
        productId,
        url: publicUrl,
        altText: product.name,
        isPrimary: existingCount === 0,
        sortOrder: existingCount,
      },
    });

    return productImage;
  }

  async handleDigitalFileUpload(productId: string, file: UploadedFilePayload) {
    if (!file) {
      throw new BadRequestException('No digital deliverable file uploaded');
    }

    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'products', productId, 'files');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer || Buffer.from(''));

    const productFile = await this.prisma.productFile.create({
      data: {
        productId,
        fileName: file.originalname,
        storagePath: filePath,
        fileSize: file.size || file.buffer?.length || 0,
        mimeType: file.mimetype || 'application/octet-stream',
        isActive: true,
      },
    });

    return productFile;
  }
}
