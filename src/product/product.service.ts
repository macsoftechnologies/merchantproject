import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { productDto } from './dto/product.dto';
import { Role } from 'src/auth/guards/roles.enum';

interface UserModel {
  _id: string;
  userId: string;
  userName: string;
  email: string;
  password: string;
  address: string;
  profileImage: string;
  mobileNumber: string;
  altMobileNumber: string;
  shopName: string;
  shopLocation: string;
  shopImage: string;
  shopLicense: string;
  role: string[]; // Assuming role is an array of strings
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async addMerchantProduct(req: productDto, image) {
    try {
      const findUser: UserModel | null = await this.userModel.findOne({
        userId: req.userId,
      });
      console.log('...user', findUser);
      if (!findUser) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        };
      } else {
        const isMerchant = findUser.role.includes(Role.MERCHANT);
        if (!isMerchant) {
          return {
            statusCode: HttpStatus.NOT_ACCEPTABLE,
            message: 'Merchant can only add products',
          };
        }
        if (image) {
          const reqDoc = image.map((doc, index) => {
            let IsPrimary = false;
            if (index == 0) {
              IsPrimary = true;
            }
            const randomNumber = Math.floor(Math.random() * 1000000 + 1);
            return doc.filename;
          });

          req.productImage = reqDoc.toString();
        }
        const addproduct = await this.productModel.create({
          productName: req.productName,
          productSpecifications: req.productSpecifications,
          userId: findUser.userId,
          productImage: req.productImage,
        });
        if (addproduct) {
          return {
            statusCode: HttpStatus.OK,
            message: 'Product added Successfully',
            data: addproduct,
          };
        } else {
          return {
            statusCode: HttpStatus.EXPECTATION_FAILED,
            message: 'Product failed to add',
          };
        }
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getProductsList() {
    try {
      const productsList = await this.productModel.aggregate([
        {
          $lookup: {
            from: 'users',
            foreignField: 'userId',
            localField: 'userId',
            as: 'userId',
          },
        },
      ]);
      if (productsList.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'List of products',
          data: productsList,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Products not found',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getProductsOfUser(req: productDto) {
    try {
      const productsList: any = await this.productModel.find({
        userId: req.userId,
      });
      console.log(productsList);
      if (productsList.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'List of products',
          count: productsList.length,
          data: productsList,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Products not found',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }


  async searchProducts(req: productDto) {
    try {
      const searchProd = await this.productModel.aggregate([
        {$match: {productName: { $regex: new RegExp(req.productName, 'i') }}},
        {
          $lookup: {
            from: "users",
            foreignField: "userId",
            localField: "userId",
            as: "userId",
          }
        }
      ]);
      if(searchProd.length>0) {
        return {
          statusCode: HttpStatus.OK,
          message: "List of searched product",
          data: searchProd,
        }
      } else {
        return{
          statusCode: HttpStatus.NOT_FOUND,
          message: "Searched products not found",
        }
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getProductById(_id: string) {
    try{
      const findProduct = await this.productModel.findOne({_id});
      if(findProduct) {
        const findProductUser = await this.productModel.aggregate([
          {$match: {_id: findProduct._id}},
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "userId",
              as: "userId",
            }
          }
        ]);
        return {
          statusCode: HttpStatus.OK,
          message: "Details of Selected Product",
          data: findProductUser,
        }
      }
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  async deleteMerchantProd(req: productDto) {
    try{
      const findProduct = await this.productModel.findOne({_id: req._id});
      if(!findProduct) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Product not found",
        }
      } else {
        const deleteProd = await this.productModel.deleteOne({_id: req._id});
      if(deleteProd) {
        return {
          statusCode: HttpStatus.OK,
          message: "Product Deleted Successfully",
        }
      } else {
        return {
          statusCode: HttpStatus.EXPECTATION_FAILED,
          message: "Product Deletion failed",
        }
      }
      }
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  async updateMerchantProduct(req: productDto, image) {
    try{
      const findProduct = await this.productModel.findOne({_id: req._id});
      if(findProduct) {
        if (image) {
          const reqDoc = image.map((doc, index) => {
            let IsPrimary = false;
            if (index == 0) {
              IsPrimary = true;
            }
            const randomNumber = Math.floor(Math.random() * 1000000 + 1);
            return doc.filename;
          });

          req.productImage = reqDoc.toString();
        }
        if(req.productImage) {
          const updateprod = await this.productModel.updateOne({_id: req._id},{
            $set: {
              productName: req.productName,
              productSpecifications: req.productSpecifications,
              productImage: req.productImage,
            }
          });
          if(updateprod) {
            return {
              statusCode: HttpStatus.OK,
              message: "Product updated successfully",
              data: updateprod,
            }
          } else {
            return {
              statusCode: HttpStatus.EXPECTATION_FAILED,
              message: "Product updation failed",
            }
          }
        } else {
          const updateprod = await this.productModel.updateOne({_id: req._id},{
            $set: {
              productName: req.productName,
              productSpecifications: req.productSpecifications
            }
          });
          if(updateprod) {
            return {
              statusCode: HttpStatus.OK,
              message: "Product updated successfully",
              data: updateprod,
            }
          } else {
            return {
              statusCode: HttpStatus.EXPECTATION_FAILED,
              message: "Product updation failed",
            }
          }
        }
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Product not found",
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
