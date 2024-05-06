import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, productSchema } from './schema/product.schema';
import { User, userSchema } from 'src/user/schema/user.schema';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MerchantProduct, merchantProductSchema } from './schema/merchantproduct.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: productSchema },
      { name: User.name, schema: userSchema },
      { name: MerchantProduct.name, schema: merchantProductSchema}
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, AuthService, JwtService],
})
export class ProductModule {}
