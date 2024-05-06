import { Module } from '@nestjs/common';
import { AdvertisementsService } from './advertisements.service';
import { AdvertisementsController } from './advertisements.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Advertisement, advertisementSchema } from './schema/advertisement.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: Advertisement.name, schema: advertisementSchema}])],
  controllers: [AdvertisementsController],
  providers: [AdvertisementsService]
})
export class AdvertisementsModule {}
