import { ApiProperty } from "@nestjs/swagger";

export class productDto{
    @ApiProperty()
    adminProductId: string
    @ApiProperty()
    productName: string
    @ApiProperty()
    categoryId: string
    @ApiProperty()
    productSpecifications: {}
    @ApiProperty()
    productImage: string
    @ApiProperty()
    _id: string
}