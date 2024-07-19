import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { productDto } from './dto/product.dto';
import { Role } from 'src/auth/guards/roles.enum';
import { merchantProductDto } from './dto/merchantproduct.dto';
import { MerchantProduct } from './schema/merchantproduct.schema';
import { MapmyIndiaSDK } from 'mapmyindia-sdk-nodejs';
import { categoryDto } from './dto/category.dto';
import { Category } from './schema/category.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(MerchantProduct.name)
    readonly merchantProductModel: Model<MerchantProduct>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async addAdminProduct(req: productDto, image) {
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

        req.productImage = reqDoc.toString();
      }
      const addproduct = await this.productModel.create({
        productName: req.productName,
        categoryId: req.categoryId,
        productSpecifications: req.productSpecifications,
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
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getProductsList() {
    try {
      const productsList = await this.productModel.aggregate([{
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "categoryId",
          as: "categoryId"
        }
      }]);
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

  async getProductById(req: productDto) {
    try {
      console.log("id", req._id);
      const findAdminProd = await this.productModel.findOne({_id: req._id});
      if(findAdminProd) {
        const findProduct = await this.productModel.aggregate([
          {$match: {_id: findAdminProd._id}},
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "categoryId",
              as: "categoryId"
            }
          }
        ]);
          return {
            statusCode: HttpStatus.OK,
            message: 'Details of Selected Product',
            data: findProduct,
          };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Product Not Found",
        }
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async searchAdminProducts(req: productDto) {
    try {
      const searchProds = await this.productModel.find({
        productName: { $regex: new RegExp(req.productName, 'i') },
      });
      if (searchProds.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Searched Products',
          data: searchProds,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Products not found by search',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async deleteMerchantProd(req: productDto) {
    try {
      const findProduct = await this.productModel.findOne({ _id: req._id });
      if (!findProduct) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product not found',
        };
      } else {
        const deleteProd = await this.productModel.deleteOne({ _id: req._id });
        if (deleteProd) {
          return {
            statusCode: HttpStatus.OK,
            message: 'Product Deleted Successfully',
          };
        } else {
          return {
            statusCode: HttpStatus.EXPECTATION_FAILED,
            message: 'Product Deletion failed',
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

  async updateMerchantProduct(req: productDto, image) {
    try {
      const findProduct = await this.productModel.findOne({ _id: req._id });
      if (findProduct) {
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
        if (req.productImage) {
          const updateprod = await this.productModel.updateOne(
            { _id: req._id },
            {
              $set: {
                productName: req.productName,
                categoryId: req.categoryId,
                productSpecifications: req.productSpecifications,
                productImage: req.productImage,
              },
            },
          );
          if (updateprod) {
            return {
              statusCode: HttpStatus.OK,
              message: 'Product updated successfully',
              data: updateprod,
            };
          } else {
            return {
              statusCode: HttpStatus.EXPECTATION_FAILED,
              message: 'Product updation failed',
            };
          }
        } else {
          const updateprod = await this.productModel.updateOne(
            { _id: req._id },
            {
              $set: {
                productName: req.productName,
                categoryId: req.categoryId,
                productSpecifications: req.productSpecifications,
              },
            },
          );
          if (updateprod) {
            return {
              statusCode: HttpStatus.OK,
              message: 'Product updated successfully',
              data: updateprod,
            };
          } else {
            return {
              statusCode: HttpStatus.EXPECTATION_FAILED,
              message: 'Product updation failed',
            };
          }
        }
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product not found',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async addMerchantProd(req: merchantProductDto) {
    try {
      const findUser = await this.userModel.findOne({ userId: req.userId });
      const findAdminProduct = await this.productModel.findOne({
        adminProductId: req.adminProductId,
      });
      const findExisted = await this.merchantProductModel.findOne({
        $and: [{ userId: req.userId }, { adminProductId: req.adminProductId }],
      });
      if (!findUser) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found.',
        };
      }
      if (!findAdminProduct) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product not found.',
        };
      }
      if (findExisted) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'Product Already added to user',
        };
      }
      const addProd = await this.merchantProductModel.create(req);
      if (addProd) {
        const findProduct = await this.merchantProductModel.aggregate([
          { $match: { _id: addProd._id } },
          {
            $lookup: {
              from: 'products',
              localField: 'adminProductId',
              foreignField: 'adminProductId',
              as: 'adminProductId',
            },
          },
        ]);
        return {
          statusCode: HttpStatus.OK,
          message: 'Merchant Product Added Successfully',
          data: findProduct,
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getMerchantProds(req: merchantProductDto) {
    try {
      const getProds = await this.merchantProductModel.aggregate([
        { $match: { userId: req.userId } },
        {
          $lookup: {
            from: 'products',
            localField: 'adminProductId',
            foreignField: 'adminProductId',
            as: 'adminProductId',
          },
        },
      ]);
      if (getProds.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'List of Merchant Products',
          data: getProds,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Products not found for this merchant',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getMerchantProdById(req: merchantProductDto) {
    try {
      const findProd = await this.merchantProductModel.findOne({
        _id: req._id,
      });
      if (!findProd) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product Not Found',
        };
      }
      const getProdById = await this.merchantProductModel.aggregate([
        { $match: { _id: findProd._id } },
        {
          $lookup: {
            from: 'products',
            localField: 'adminProductId',
            foreignField: 'adminProductId',
            as: 'adminProductId',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: 'userId',
            as: 'userId',
          },
        },
      ]);
      console.log('jsd', findProd);
      if (getProdById) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Details of Merchant Product',
          data: getProdById,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product Details Not Found',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async editMerchantProduct(req: merchantProductDto) {
    try {
      const editProd = await this.merchantProductModel.updateOne(
        { _id: req._id },
        {
          $set: { price: req.price },
        },
      );
      if (editProd) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Merchant Product Updated Successfully',
          data: editProd,
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async deleteMerchantProduct(req: merchantProductDto) {
    try {
      const deleteProd = await this.merchantProductModel.deleteOne({
        _id: req._id,
      });
      if (deleteProd) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Product Deleted Successfully',
          data: deleteProd,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Product deletion failed',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async searchProductsByLocation(req: merchantProductDto) {
    try {
      const { longitude, latitude } = req;
      const getUsers = await this.userModel.find({
        $and: [
          {
            coordinates: {
              $nearSphere: {
                $geometry: {
                  type: 'Point',
                  coordinates: [longitude, latitude], // Ensure that coordinates are in the correct order (longitude, latitude)
                },
                $maxDistance: 20000, // Adjust the maximum distance as needed
              },
            },
          },
          { role: { $elemMatch: { $eq: 'merchant' } } },
        ],
      });
      const userIds = getUsers.map((user) => user.userId);
      const findAdminProducts = await this.productModel.find({categoryId: req.categoryId});
      console.log("catadminprods", findAdminProducts);
      const merchantProds = await Promise.all(
        findAdminProducts.map(async (product) => {
          const matchedProduct = await this.merchantProductModel.aggregate([
            {
              $match: { adminProductId: product.adminProductId },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: 'userId',
                as: 'userId',
              },
            },
            {
              $lookup: {
                from: 'products',
                localField: 'adminProductId',
                foreignField: 'adminProductId',
                as: 'adminProductId',
              },
            },
          ]);
          return matchedProduct;
        }),
      );
      const flattenedMerchantProds = merchantProds.flat();
      const filteredMerchantProds = flattenedMerchantProds.filter((product) =>
        userIds.includes(product.userId[0].userId),
      );

      if (filteredMerchantProds.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'List of products',
          data: filteredMerchantProds,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Search products not found',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async addCategory(req: categoryDto, image) {
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

        req.categoryImage = reqDoc.toString();
      }
      const findExisted = await this.categoryModel.findOne({
        categoryName: { $regex: new RegExp(req.categoryName, 'i') },
      });
      if (findExisted) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'Category already exists',
        };
      } else {
        const createCategory = await this.categoryModel.create(req);
      if (createCategory) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Category added successfully',
          data: createCategory,
        };
      } else {
        return {
          statusCode: HttpStatus.EXPECTATION_FAILED,
          message: 'Unable to create category',
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

  async getCategoryList() {
    try{
      const getCategories = await this.categoryModel.find()
      if(getCategories.length>0) {
        return {
          statusCode: HttpStatus.OK,
          message: "List of categories",
          data: getCategories,
        }
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "No Categories found",
        }
      }
    } catch(error){
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  async editCategory(req: categoryDto, image) {
    try {
      const findCategory = await this.categoryModel.findOne({ _id: req._id });
      console.log("category", findCategory);
      if (!findCategory) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Category Not Found',
        };
      } else {
        if (image) {
          const reqDoc = image.map((doc, index) => {
            let IsPrimary = false;
            if (index == 0) {
              IsPrimary = true;
            }
            const randomNumber = Math.floor(Math.random() * 1000000 + 1);
            return doc.filename;
          });
  
          req.categoryImage = reqDoc.toString();
        }

        if(req.categoryImage) {
          const editCategory = await this.categoryModel.updateOne({_id: req._id}, {
            $set: {
              categoryName: req.categoryName,
              categoryImage: req.categoryImage
            }
          });
          if (editCategory) {
            return {
              statusCode: HttpStatus.OK,
              message: 'Category Edited successfully',
              data: editCategory,
            };
          } else {
            return {
              statusCode: HttpStatus.EXPECTATION_FAILED,
              message: 'Unable to create category',
            };
          }
        } else {
          const editCategory = await this.categoryModel.updateOne({_id: req._id}, {
            $set: {
              categoryName: req.categoryName,
            }
          });
          if (editCategory) {
            return {
              statusCode: HttpStatus.OK,
              message: 'Category Edited successfully',
              data: editCategory,
            };
          } else {
            return {
              statusCode: HttpStatus.EXPECTATION_FAILED,
              message: 'Unable to create category',
            };
          }
        }
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async deleteCategory(req: categoryDto) {
    try{
      const removeCategory = await this.categoryModel.deleteOne({_id: req._id});
      if(removeCategory) {
        return {
          statusCode: HttpStatus.OK,
          message: "Deleted Category Successfully",
        }
      } else {
        return {
          statusCode: HttpStatus.EXPECTATION_FAILED,
          message: "Unable to delete category",
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
