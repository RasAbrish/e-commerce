import { Controller, Get, Post, Param, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { DownloadsService } from './downloads.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('api/downloads')
export class DownloadsController {
  constructor(private downloadsService: DownloadsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my-files')
  async getMyFiles(@CurrentUser('id') userId: string) {
    const files = await this.downloadsService.getUserPurchasedFiles(userId);
    return { success: true, data: files };
  }

  @UseGuards(JwtAuthGuard)
  @Post('token/:orderId/:fileId')
  async generateToken(
    @CurrentUser('id') userId: string,
    @Param('orderId') orderId: string,
    @Param('fileId') fileId: string,
  ) {
    const result = await this.downloadsService.generateToken(userId, fileId, orderId);
    return { success: true, data: result };
  }

  @Get('file/:token')
  async downloadFile(
    @Param('token') token: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    const file = await this.downloadsService.validateAndGetFile(token, ip, userAgent);

    res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);

    // Dummy buffer payload for sample/mock digital products in development
    const sampleBuffer = Buffer.from(
      `Bright Ideas Digital Delivery System\nProduct: ${file.fileName}\nThank you for your purchase!\nTimestamp: ${new Date().toISOString()}`,
    );
    res.send(sampleBuffer);
  }
}
