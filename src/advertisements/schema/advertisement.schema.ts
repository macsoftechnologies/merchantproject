import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
@Schema({ timestamps: true })

export class Advertisement extends Document{
    @Prop()
    advertisement: []
    @Prop({ 
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // Define coordinates as an array of numbers
            index: '2dsphere' // Define 2dsphere index on coordinates
        }
    })
    coordinates: [number];
    @Prop()
    radius: number
}

export const advertisementSchema = SchemaFactory.createForClass(Advertisement);