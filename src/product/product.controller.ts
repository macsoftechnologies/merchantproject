import { Body, Controller, Get, HttpStatus, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { productDto } from './dto/product.dto';
import { AnyFilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { Role } from 'src/auth/guards/roles.enum';
import { merchantProductDto } from './dto/merchantproduct.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/addproduct')
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
  async addProduct(@Body() req: productDto, @UploadedFiles() image) {
    try{
      const addproduct = await this.productService.addAdminProduct(req, image);
      return addproduct
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MERCHANT)
  @Get('/getproductslist')
  async getProductsList() {
    try{
      const addproduct = await this.productService.getProductsList();
      return addproduct
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Post('/getproductbyid')
  async getProductDetails(@Body() _id: string) {
    try{
      const productDetails = await this.productService.getProductById(_id);
      return productDetails
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/deleteproduct')
  async deleteMerchantProd(@Body() req: productDto) {
    try{
      const deleteProd = await this.productService.deleteMerchantProd(req);
      return deleteProd
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post("/updateproduct")
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
  async updateProduct(@Body() req: productDto, @UploadedFiles() image) {
    try{
      const moderateProduct = await this.productService.updateMerchantProduct(req, image);
      return moderateProduct
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.MERCHANT)
  @Post('/addmerchantproduct')
  async addMerchantProduct(@Body() req: merchantProductDto) {
    try{
      const addmerchantprod = await this.productService.addMerchantProd(req);
      return addmerchantprod
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.MERCHANT, Role.ADMIN)
  @Post('/getmerchantproducts')
  async getMerchantProducts(@Body() req: merchantProductDto) {
    try{
      const addmerchantprod = await this.productService.getMerchantProds(req);
      return addmerchantprod
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.MERCHANT, Role.ADMIN, Role.CUSTOMER)
  @Post('/getmerchantproductbyid')
  async getMerchantProductById(@Body() req: merchantProductDto) {
    try{
      const addmerchantprod = await this.productService.getMerchantProdById(req);
      return addmerchantprod
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.MERCHANT)
  @Post('/editmerchantproduct')
  async editMerchantProduct(@Body() req: merchantProductDto) {
    try{
      const addmerchantprod = await this.productService.editMerchantProduct(req);
      return addmerchantprod
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.MERCHANT)
  @Post('/deletemerchantproduct')
  async deleteMerchantProduct(@Body() req: merchantProductDto) {
    try{
      const addmerchantprod = await this.productService.deleteMerchantProduct(req);
      return addmerchantprod
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Post('/searchproducts')
  async searchProducts(@Body() req:merchantProductDto) {
    try{
      const getproducts = await this.productService.searchProductsByLocation(req);
      return getproducts
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }
}
