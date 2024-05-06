import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
@Schema({ timestamps: true })

export class MerchantProduct extends Document{
    @Prop()
    adminProductId: string
    @Prop()
    userId: string
    @Prop()
    price: number
}

export const merchantProductSchema = SchemaFactory.createForClass(MerchantProduct);