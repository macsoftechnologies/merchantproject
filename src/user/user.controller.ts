import { Body, Controller, Get, HttpStatus, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { userDto } from './dto/user.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/guards/roles.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/merchantregister')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profileImage' },
      { name: 'shopImage' },
      { name: 'shopLicense' },
    ]),
  )
  async merchantRegister(@Body() req: userDto, @UploadedFiles() image) {
    try{
      const registermerchant = await this.userService.registerMerchant(req, image);
      return registermerchant
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  } 
  
  @Post('/customerregister')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profileImage' },
      { name: 'shopImage' },
      { name: 'shopLicense' },
    ]),
  )
  async customerRegister(@Body() req: userDto, @UploadedFiles() image) {
    try{
      const registermerchant = await this.userService.registerCustomer(req, image);
      return registermerchant
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  } 

  @Post('/loginuser')
  async loginUser(@Body() req: userDto) {
    try{
      const loginUser = await this.userService.loginUser(req);
      return loginUser
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.MERCHANT, Role.CUSTOMER)
  @Post('/switchuser')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profileImage' },
      { name: 'shopImage' },
      { name: 'shopLicense' },
    ]),
  )
  async switchUserRole(@Body() req: userDto, @UploadedFiles() image) {
    try{
      const switchUser = await this.userService.switchUser(req, image);
      return switchUser
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  // @UseGuards(JwtGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  @Get('/getuserslist')
  async getUsersList() {
    try{
      const list = await this.userService.getUsersList();
      return list
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @Get('/getmerchantslist')
  async getMerchantsList() {
    try{
      const list = await this.userService.getMerchantsList();
      return list
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @Get('/getcustomerslist')
  async getCustomersList() {
    try{
      const list = await this.userService.getCustomersList();
      return list
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Post('/getuserbyid')
  async getUserById(@Body() req: userDto) {
    try{
      const list = await this.userService.getUserById(req);
      return list
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.MERCHANT, Role.CUSTOMER)
  @Post('/updateuser')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profileImage' },
      { name: 'shopImage' },
      { name: 'shopLicense' },
    ]),
  )
  async updateUser(@Body() req: userDto, @UploadedFiles() image) {
    try{
      const modifyUser = await this.userService.updateUser(req, image);
      return modifyUser
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/deleteuser')
  async deleteUser(@Body() req: userDto) {
    try{
      const deleteUser = await this.userService.deleteUser(req);
      return deleteUser
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }
}
