import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"
@Schema()
export class specifications{}
@Schema({ timestamps: true })

export class Product extends Document{
    @Prop()
    productName: string
    @Prop({trim: true,strict:true,type:specifications})
    productSpecifications: {
        type:any 
    }
    @Prop()
    userId: string
    @Prop()
    productImage: string
    @Prop()
    price: number
}

export const productSchema = SchemaFactory.createForClass(Product);