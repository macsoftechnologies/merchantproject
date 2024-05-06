import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { AdvertisementsModule } from './advertisements/advertisements.module';
// const mongoURI = process.env.MONGO_URI;
const mongoURI =
  process.env.MONGO_URI ||
  'mongodb+srv://macsof:macsof@nextlevelcarwash.yjs3i.mongodb.net/Merchant?retryWrites=true&w=majority';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(mongoURI),
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      useFactory: () => ({
        secretOrKey: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '10s',
        },
      }),
    }),
    AdminModule,
    UserModule,
    ProductModule,
    AdvertisementsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    JwtService,
  ],
})
export class AppModule {}
