import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { userDto } from './dto/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { Role } from 'src/auth/guards/roles.enum';

interface UserModel {
  _id: string;
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
  role: string[]; // Assuming role is an array of strings
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  async registerMerchant(req: userDto, image) {
    try {
      const findUser = await this.userModel.findOne({
        mobileNumber: req.mobileNumber,
      });
      if (!findUser) {
        if (image) {
          if (image.profileImage && image.profileImage[0]) {
            const attachmentFile = await this.authService.saveFile(
              image.profileImage[0],
            );
            req.profileImage = attachmentFile;
          }
          if (image.shopImage && image.shopImage[0]) {
            const attachmentFile = await this.authService.saveFile(
              image.shopImage[0],
            );

            req.shopImage = attachmentFile;
          }
        } else {
          req.profileImage === "";
          req.shopImage === "";
        }
        if (
          req.shopName === ' ' ||
          req.shopName === '' ||
          !req.shopName ||
          !req.mobileNumber ||
          req.mobileNumber === '' ||
          req.mobileNumber === ' '
        ) {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Please provide all required details',
          };
        }
        if(!req.priority) {
          req.priority = 0
        }
        const createMerchant = await this.userModel.create({
          userName: req.userName,
          mobileNumber: req.mobileNumber,
          address: req.address,
          profileImage: req.profileImage,
          shopImage: req.shopImage,
          shopName: req.shopName,
          role: Role.MERCHANT,
          otp: '',
          coordinates: {
            type: "Point",
            coordinates: [req.longitude, req.latitude]
          }
        });
        if (createMerchant) {
          return {
            statusCode: HttpStatus.OK,
            message: 'Merchant Registered Successfully',
            data: createMerchant,
          };
        } else {
          return {
            statusCode: HttpStatus.EXPECTATION_FAILED,
            message: 'Merchant Registration Failed',
          };
        }
      } else {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'User Already Existed',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async registerCustomer(req: userDto, image) {
    try {
      const findUser = await this.userModel.findOne({
        mobileNumber: req.mobileNumber,
      });
      if (!findUser) {
        if (image) {
          if (image.profileImage && image.profileImage[0]) {
            const attachmentFile = await this.authService.saveFile(
              image.profileImage[0],
            );
            req.profileImage = attachmentFile;
          }
          if (image.shopImage && image.shopImage[0]) {
            const attachmentFile = await this.authService.saveFile(
              image.shopImage[0],
            );

            req.shopImage = attachmentFile;
          }
        }
        if (
          !req.mobileNumber ||
          req.mobileNumber === '' ||
          req.mobileNumber === ' '
        ) {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Please provide all required details',
          };
        }
        const createCustomer = await this.userModel.create({
          userName: req.userName,
          mobileNumber: req.mobileNumber,
          address: req.address,
          profileImage: req.profileImage,
          shopImage: '',
          shopName: '',
          role: Role.CUSTOMER,
          otp: '',
          coordinates: {
            type: "Point",
            coordinates: [req.longitude, req.latitude]
          }
        });
        if (createCustomer) {
          return {
            statusCode: HttpStatus.OK,
            message: 'Merchant Registered Successfully',
            data: createCustomer,
          };
        } else {
          return {
            statusCode: HttpStatus.EXPECTATION_FAILED,
            message: 'Merchant Registration Failed',
          };
        }
      } else {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'User Already Existed',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async loginUser(req: userDto) {
    try {
      const findUser = await this.userModel.findOne({mobileNumber: req.mobileNumber});
      if (!findUser) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Admin Not Found',
        };
      } else {
        // let generatedOtp = Math.floor(1000 + Math.random() * 9000);
        // const updateOTP = await this.userModel.updateOne({_id: findUser._id},{
        //   $set: {
        //     otp: generatedOtp
        //   }
        // });
        if (req.otp === "1234") {
          const jwtToken = await this.authService.createToken({ findUser });
          return {
            statusCode: HttpStatus.OK,
            message: 'Admin Login successfull',
            token: jwtToken,
            data: findUser,
          };
        } else {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: "Invalid OTP"
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

  async switchUser(req: userDto, image) {
    try {
      const findCustomer: UserModel | null = await this.userModel.findOne({mobileNumber: req.mobileNumber});
      if (findCustomer) {
        const isCustomer = findCustomer.role.includes(Role.CUSTOMER);
        const isMerchant = findCustomer.role.includes(Role.MERCHANT);
        if (isCustomer && !isMerchant) {
          if (!req.shopName || req.shopName === '' || req.shopName === ' ') {
            return {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Please provide shopname',
            };
          } else {
            if (image) {
              if (image.profileImage && image.profileImage[0]) {
                const attachmentFile = await this.authService.saveFile(
                  image.profileImage[0],
                );
                req.profileImage = attachmentFile;
              }
              if (image.shopImage && image.shopImage[0]) {
                const attachmentFile = await this.authService.saveFile(
                  image.shopImage[0],
                );

                req.shopImage = attachmentFile;
              }
            }
            const switchToMerchant = await this.userModel.updateOne(
              {mobileNumber: req.mobileNumber},
              {
                $set: {
                  shopName: req.shopName,
                  shopImage: req.shopImage,
                },
                $push: {
                  role: Role.MERCHANT,
                },
              },
            );
            if (switchToMerchant) {
              return {
                statusCode: HttpStatus.OK,
                message: 'Customer switched to merchant successfully',
              };
            } else {
              return {
                statusCode: HttpStatus.EXPECTATION_FAILED,
                message: 'Customer not switched to merchant',
              };
            }
          }
        } else if (isMerchant && !isCustomer) {
          const switchToCustomer = await this.userModel.updateOne(
            {mobileNumber: req.mobileNumber},
            {
              $push: {
                role: Role.CUSTOMER,
              },
            },
          );
          if (switchToCustomer) {
            return {
              statusCode: HttpStatus.OK,
              message: 'Merchant switched to Customer Successfully',
            };
          } else {
            return {
              statusCode: HttpStatus.EXPECTATION_FAILED,
              message: 'Merchant failed to switch as customer',
            };
          }
        } else {
          return {
            statusCode: HttpStatus.CONFLICT,
            message: 'User is already both merchant and customer',
          };
        }
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User Not Found',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getUsersList() {
    try{
      const usersList = await this.userModel.find();
      if(usersList.length>0) {
        return {
          statusCode: HttpStatus.OK,
          message: "List of users",
          usersCount: usersList.length,
          data: usersList
        }
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Users Not Found",
        }
      }
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  async getMerchantsList() {
    try{
      const usersList = await this.userModel.find();
      if(usersList.length>0) {
        let list = [];
        for(const merchantRecord of usersList) {
          const findUser: UserModel | null = await this.userModel.findOne({_id: merchantRecord._id});
          const isMerchant = findUser.role.includes(Role.MERCHANT);
          if(isMerchant) {
            list.push(merchantRecord);
          } else {
            continue;
          }
        }
        return {
          statusCode: HttpStatus.OK,
          message: "List of users",
          merchantsCount: list.length,
          data: list,
        }
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Users Not Found",
        }
      }
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  async getCustomersList() {
    try{
      const usersList = await this.userModel.find();
      if(usersList.length>0) {
        let list = [];
        for(const merchantRecord of usersList) {
          const findUser: UserModel | null = await this.userModel.findOne({_id: merchantRecord._id});
          const isMerchant = findUser.role.includes(Role.MERCHANT);
          const isCustomer = findUser.role.includes(Role.CUSTOMER);
          if(isCustomer && !isMerchant) {
            list.push(merchantRecord);
          } else {
            continue;
          }
        }
        return {
          statusCode: HttpStatus.OK,
          message: "List of users",
          customersCount: list.length,
          data: list,
        }
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Users Not Found",
        }
      }
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  async getUserById(req: userDto) {
    try{
      const findUser = await this.userModel.findOne({_id: req._id});
      if(findUser) {
        return {
          statusCode: HttpStatus.OK,
          message: "Details of user",
          data: findUser,
        }
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "User not found",
        }
      }
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  async updateUser(req: userDto, image) {
    try {
      const findUser = await this.userModel.findOne({ _id: req._id });
      if (!findUser) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        };
      }
  
      // Process images if provided
      if (image) {
        if (image.profileImage && image.profileImage[0]) {
          const attachmentFile = await this.authService.saveFile(image.profileImage[0]);
          req.profileImage = attachmentFile;
        }
        if (image.shopImage && image.shopImage[0]) {
          const attachmentFile = await this.authService.saveFile(image.shopImage[0]);
          req.shopImage = attachmentFile;
        }
      }
  
      const updateData: any = {
        userName: req.userName,
        address: req.address,
        profileImage: req.profileImage,
        mobileNumber: req.mobileNumber,
        shopName: req.shopName,
        shopImage: req.shopImage,
      };
  
      if (req.longitude !== undefined && req.latitude !== undefined) {
        updateData.coordinates = {
          type: "Point",
          coordinates: [req.longitude, req.latitude],
        };
      }
  
      const modifyUser = await this.userModel.updateOne(
        { _id: req._id },
        { $set: updateData },
      );
  
      if (modifyUser.modifiedCount > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: "User updated successfully",
          data: modifyUser,
        };
      } else {
        return {
          statusCode: HttpStatus.EXPECTATION_FAILED,
          message: "User update failed",
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || error,
      };
    }
  }
  
 
  async deleteUser(req: userDto) {
    try{
      const findUser = await this.userModel.findOne({_id: req._id});
      if(findUser) {
        const deleteUser = await this.userModel.deleteOne({_id: req._id});
        if(deleteUser) {
          return {
            statusCode: HttpStatus.OK,
            message: "User deleted Successfully",
            data: deleteUser,
          }
        } else {
          return {
            statusCode: HttpStatus.EXPECTATION_FAILED,
            message: "User not deleted",
          }
        }
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "User not found",
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
