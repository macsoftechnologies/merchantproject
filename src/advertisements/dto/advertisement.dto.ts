import { ApiProperty } from "@nestjs/swagger";

export class advertisementDto{
    @ApiProperty()
    _id: string
    @ApiProperty()
    advertisement: string
    @ApiProperty()
    latitude: string
    @ApiProperty()
    longitude: string
    @ApiProperty()
    radius: number
}