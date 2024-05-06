import { ApiProperty } from "@nestjs/swagger";

export class merchantProductDto{
    @ApiProperty()
    _id: string
    @ApiProperty()
    adminProductId: string
    @ApiProperty()
    userId: string
    @ApiProperty()
    price: number
}