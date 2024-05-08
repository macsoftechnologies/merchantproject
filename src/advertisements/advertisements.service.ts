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

  async addAdvertisement(req: advertisementDto, image) {
    try{
      if (image) {
        const reqDoc = image.map((doc, index) => {
          let IsPrimary = false;
          if (index == 0) {
            IsPrimary = true;
          }
          const randomNumber = Math.floor(Math.random() * 1000000 + 1);
          return doc.filename;
        });

        req.advertisement = reqDoc;
      }
      console.log(req.advertisement);
      const createAdd = await this.advertisementModel.create(req);
      if(createAdd) {
        return {
          statusCode: HttpStatus.OK,
          message: "Advertisement added successfully",
          data: createAdd
        }
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Advertisement not added successfully",
        }
      }
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  async getAdvertisements() {
    try{
      const getads = await this.advertisementModel.find();
      if(getads.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: "List of advertisements",
          data: getads
        }
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Advertisements not found"
        }
      }
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  async getAdvertisementById(req: advertisementDto) {
    try{
      const getads = await this.advertisementModel.findOne({_id: req._id});
      if(getads) {
        return {
          statusCode: HttpStatus.OK,
          message: "Advertisement Details",
          data: getads
        }
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Advertisement not found"
        }
      }
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }
}
