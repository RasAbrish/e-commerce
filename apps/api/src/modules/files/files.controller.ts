import { Controller, Post, Param, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService, UploadedFilePayload } from './files.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('api/files')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post('product-image/:productId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProductImage(
    @Param('productId') productId: string,
    @UploadedFile() file: UploadedFilePayload,
  ) {
    const result = await this.filesService.handleProductImageUpload(productId, file);
    return { success: true, data: result };
  }

  @Post('digital-deliverable/:productId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDigitalFile(
    @Param('productId') productId: string,
    @UploadedFile() file: UploadedFilePayload,
  ) {
    const result = await this.filesService.handleDigitalFileUpload(productId, file);
    return { success: true, data: result };
  }
}
