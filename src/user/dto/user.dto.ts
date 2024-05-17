import { ApiProperty } from "@nestjs/swagger";

export class userDto{
    @ApiProperty()
    userId: string
    @ApiProperty()
    userName: string
    @ApiProperty()
    email: string
    @ApiProperty()
    password: string
    @ApiProperty()
    address: string
    @ApiProperty()
    profileImage: string
    @ApiProperty()
    mobileNumber: string
    @ApiProperty()
    altMobileNumber: string
    @ApiProperty()
    shopName: string
    @ApiProperty()
    shopLocation: string
    @ApiProperty()
    shopImage: string
    @ApiProperty()
    shopLicense: string
    @ApiProperty()
    role: string[]
    @ApiProperty()
    _id: string
    @ApiProperty()
    priority: number
    @ApiProperty()
    latitude: number
    @ApiProperty()
    longitude: number
    @ApiProperty()
    coordinates: [number];
}