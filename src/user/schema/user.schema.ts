import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { v4 as uuid } from 'uuid';
// class location{
//     @Prop({ default: "Point" })
//     type: string
//     @Prop({ default: 0 })
//     coordinates: number[]
// }
@Schema({ timestamps: true })

export class User extends Document{
    @Prop({default: uuid})
    userId: string
    @Prop()
    userName: string
    @Prop()
    address: string
    @Prop()
    profileImage: string
    @Prop()
    mobileNumber: string
    @Prop()
    shopName: string
    @Prop()
    shopImage: string
    @Prop()
    role: []
    @Prop()
    priority: number
    @Prop()
    otp: string
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
}

const userSchema = SchemaFactory.createForClass(User);

userSchema.index({ coordinates: '2dsphere' });

export { userSchema };