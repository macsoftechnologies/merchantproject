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
    try {
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
      const createAdd = await this.advertisementModel.create({
        advertisement: req.advertisement,
        radius: req.radius,
        coordinates: {
          type: 'Point',
          coordinates: [req.longitude, req.latitude],
        },
      });
      if (createAdd) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Advertisement added successfully',
          data: createAdd,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Advertisement not added successfully',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getAdvertisements() {
    try {
      const getads = await this.advertisementModel.find();
      if (getads.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'List of advertisements',
          data: getads,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Advertisements not found',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getAdvertisementById(req: advertisementDto) {
    try {
      const getads = await this.advertisementModel.findOne({ _id: req._id });
      if (getads) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Advertisement Details',
          data: getads,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Advertisement not found',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getAdvertisementByLocation(req: advertisementDto) {
    try {
      const { longitude, latitude } = req;
      const getads = await this.advertisementModel.find();
      const filteredAds = getads.filter((ad) => {
        const adLocation = ad.coordinates;
        const distance = this.calculateDistance(adLocation, {
          type: 'Point',
          coordinates: [longitude, latitude],
        });
        return distance <= ad.radius * 1000;
      });
      if(filteredAds.length > 0) {
        const allAdvertisements = filteredAds.reduce((acc, ad) => {
          return acc.concat(ad.advertisement);
        }, []);
        return {
          statusCode: HttpStatus.OK,
          message: "List of advertisements",
          data: allAdvertisements
        }
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Advertisements not found on this location."
        }
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }
  calculateDistance(point1, point2) {
    const earthRadius = 6371e3; // Earth's radius in meters
    const [lon1, lat1] = point1.coordinates;
    const [lon2, lat2] = point2.coordinates;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadius * c;
    return distance;
  }

  async editAdvertisement(req: advertisementDto, image) {
    try {
      const findAd = await this.advertisementModel.findOne({ _id: req._id });
      if (!findAd) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Advertisement not found',
        };
      }
  
      const updateData: any = {
        radius: req.radius,
      };

      if(req.advertisement || image) {
        // Process images if provided
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
        updateData.advertisement = req.advertisement
      }
  
      if (req.longitude !== undefined && req.latitude !== undefined) {
        updateData.coordinates = {
          type: "Point",
          coordinates: [req.longitude, req.latitude],
        };
      }
  
      const modifyAd = await this.advertisementModel.updateOne(
        { _id: req._id },
        { $set: updateData },
      );
  
      if (modifyAd.modifiedCount > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: "Advertisement updated successfully",
          data: modifyAd,
        };
      } else {
        return {
          statusCode: HttpStatus.EXPECTATION_FAILED,
          message: "Advertisement update failed",
        };
      }
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  async deleteAdvertisement(req: advertisementDto) {
    try{
      const findAd = await this.advertisementModel.findOne({_id: req._id});
      if(!findAd) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Advertisement Not Found",
        }
      }
      const removeAd = await this.advertisementModel.deleteOne({_id: req._id});
      if(removeAd) {
        return {
          statusCode: HttpStatus.OK,
          message: "Advertisement Deleted Successfully",
          data: removeAd,
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
