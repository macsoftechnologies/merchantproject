import { ApiProperty } from "@nestjs/swagger";

export class productDto{
    @ApiProperty()
    productName: string
    @ApiProperty()
    productSpecifications: {}
    @ApiProperty()
    userId: string
    @ApiProperty()
    productImage: string
    @ApiProperty()
    _id: string
    @ApiProperty()
    price: number
}