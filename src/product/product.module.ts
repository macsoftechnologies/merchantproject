import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, productSchema } from './schema/product.schema';
import { User, userSchema } from 'src/user/schema/user.schema';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MerchantProduct, merchantProductSchema } from './schema/merchantproduct.schema';
import { Category, categorySchema } from './schema/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: productSchema },
      { name: User.name, schema: userSchema },
      { name: MerchantProduct.name, schema: merchantProductSchema},
      { name: Category.name, schema: categorySchema}
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, AuthService, JwtService],
})
export class ProductModule {}
