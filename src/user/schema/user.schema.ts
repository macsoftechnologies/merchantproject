import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { v4 as uuid } from 'uuid';
@Schema({ timestamps: true })

export class User extends Document{
    @Prop({default: uuid})
    userId: string
    @Prop()
    userName: string
    @Prop()
    email: string
    @Prop()
    password: string
    @Prop()
    address: string
    @Prop()
    profileImage: string
    @Prop()
    mobileNumber: string
    @Prop()
    altMobileNumber: string
    @Prop()
    shopName: string
    @Prop()
    shopLocation: string
    @Prop()
    shopImage: string
    @Prop()
    shopLicense: string
    @Prop()
    role: []
    @Prop()
    priority: number
    @Prop()
    latitude: number
    @Prop()
    longitude: number
}

export const userSchema = SchemaFactory.createForClass(User);