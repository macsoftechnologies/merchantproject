import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
@Schema({ timestamps: true })

export class Advertisement extends Document{
    @Prop()
    advertisement: string
    @Prop()
    latitude: string
    @Prop()
    longitude: string
    @Prop()
    radius: number
}

export const advertisementSchema = SchemaFactory.createForClass(Advertisement);