import { HttpStatus, Injectable } from '@nestjs/common';
import { adminDto } from './dto/admin.dto';
import { Admin } from './schema/admin.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private readonly authService: AuthService,
  ) {}

  async createAdmin(req: adminDto) {
    try {
      const findAdmin = await this.adminModel.findOne({ emailId: req.emailId });
      if (!findAdmin) {
        const bcryptPassword = await this.authService.hashPassword(
          req.password,
        );
        req.password = bcryptPassword;
        const createAdmin = await this.adminModel.create({
            emailId: req.emailId,
            password: bcryptPassword,
        });
        if(createAdmin) {
            return {
                statusCode: HttpStatus.OK,
                message: "Admin Registered Successfully",
                data: createAdmin,
            }
        } else {
            return {
                statusCode: HttpStatus.EXPECTATION_FAILED,
                message: "Failed to create admin"
            }
        }
      } else {
        return {
            statusCode: HttpStatus.CONFLICT,
            message: "Admin already existed",
        }
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async loginAdmin(req: adminDto) {
    try {
        const findAdmin = await this.adminModel.findOne({ emailId: req.emailId });
        if (!findAdmin) {
          return {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Admin Not Found',
          };
        } else {
          const matchPassword = await this.authService.comparePassword(
            req.password,
            findAdmin.password,
          );
          // console.log(matchPassword);
          if (matchPassword) {
            const jwtToken = await this.authService.createToken({ findAdmin });
            //   console.log(jwtToken);
            return {
              statusCode: HttpStatus.OK,
              message: 'Admin Login successfull',
              token: jwtToken,
              data: findAdmin,
            };
          } else {
            return {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Password incorrect',
            };
          }
        }
      } catch(error) {
        return {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error,
        }
    }
  }

  async forgotPassword(req: adminDto) {
    try{
        const findAdmin = await this.adminModel.findOne({emailId: req.emailId});
        if(findAdmin) {
            const bcryptPassword = await this.authService.hashPassword(
                req.password,
            );
            req.password = bcryptPassword;
            const forgotPassword = await this.adminModel.updateOne({emailId: findAdmin.emailId},{
                $set: {
                    password: req.password,
                }
            });
            if(forgotPassword) {
                return {
                    statusCode: HttpStatus.OK,
                    message: "Password Updated Successfully",
                    data: forgotPassword,
                }
            } else {
                return {
                    statusCode: HttpStatus.EXPECTATION_FAILED,
                    message: "Password updation failed",
                }
            }
        } else {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: "Admin not found",
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
