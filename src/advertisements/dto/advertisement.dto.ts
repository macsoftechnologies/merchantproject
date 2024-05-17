import { ApiProperty } from "@nestjs/swagger";

export class advertisementDto{
    @ApiProperty()
    _id: string
    @ApiProperty()
    advertisement: []
    @ApiProperty()
    latitude: string
    @ApiProperty()
    longitude: string
    @ApiProperty()
    coordinates: [number];
    @ApiProperty()
    radius: number
}