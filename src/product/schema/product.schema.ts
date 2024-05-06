import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"
import { v4 as uuid } from "uuid"
@Schema()
export class specifications{}
@Schema({ timestamps: true })

export class Product extends Document{
    @Prop({default: uuid})
    adminProductId: string
    @Prop()
    productName: string
    @Prop({trim: true,strict:true,type:specifications})
    productSpecifications: {
        type:any 
    }
    @Prop()
    productImage: string
}

export const productSchema = SchemaFactory.createForClass(Product);