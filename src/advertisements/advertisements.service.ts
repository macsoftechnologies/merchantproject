import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Advertisement } from './schema/advertisement.schema';
import { Model } from 'mongoose';
import { advertisementDto } from './dto/advertisement.dto';

@Injectable()
export class AdvertisementsService {
  constructor(
    @InjectModel(Advertisement.name)
    private readonly advertisementModel: Model<Advertisement>,
  ) {}

  // async addAdvertisement(req: advertisementDto) {
  //   try{
  //     const createAdd = await this.advertisementModel.create(req);
  //   } catch(error) {
  //     return {
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //       message: error,
  //     }
  //   }
  // }
}
