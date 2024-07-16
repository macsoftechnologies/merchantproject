import { ApiProperty } from "@nestjs/swagger";

export class userDto{
    @ApiProperty()
    userId: string
    @ApiProperty()
    userName: string
    @ApiProperty()
    address: string
    @ApiProperty()
    profileImage: string
    @ApiProperty()
    mobileNumber: string
    @ApiProperty()
    shopName: string
    @ApiProperty()
    shopImage: string
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
    @ApiProperty()
    otp: string;
}