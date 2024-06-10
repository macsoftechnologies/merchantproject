import { Body, Controller, Get, HttpStatus, UseGuards, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AdvertisementsService } from './advertisements.service';
import { advertisementDto } from './dto/advertisement.dto';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/auth/guards/roles.enum';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('advertisements')
export class AdvertisementsController {
  constructor(private readonly advertisementsService: AdvertisementsService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post("addAdvertisement")
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './files',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async addAdvertisement(@Body() req: advertisementDto, @UploadedFiles() image) {
    try{
      const addAdv = await this.advertisementsService.addAdvertisement(req, image);
      return addAdv
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get("/getadvertisements")
  async getAds() {
    try{
      const getads = await this.advertisementsService.getAdvertisements();
      return getads
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post("/getadvertisements")
  async getAdById(@Body() req: advertisementDto) {
    try{
      const getads = await this.advertisementsService.getAdvertisementById(req);
      return getads
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Post('/getadsbylocation')
  async getAdsByLocation(@Body() req: advertisementDto) {
    try{
      const getads = await this.advertisementsService.getAdvertisementByLocation(req);
      return getads
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/editadvertisement')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './files',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async editAdvertisement(@Body() req: advertisementDto, @UploadedFiles() image) {
    try{
      const editAd = await this.advertisementsService.editAdvertisement(req, image);
      return editAd
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/deleteadvertisement')
  async delAdvertisement(@Body() req: advertisementDto) {
    try{
      const removeAd = await this.advertisementsService.deleteAdvertisement(req);
      return removeAd
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/deleteadvertisementfile')
  async delAdvertisementFile(@Body() req: advertisementDto) {
    try{
      const removeAdFile = await this.advertisementsService.deleteAdvertisementFile(req);
      return removeAdFile
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }
}
