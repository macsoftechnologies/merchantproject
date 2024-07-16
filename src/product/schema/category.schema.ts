import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"
import { v4 as uuid } from 'uuid'
@Schema({ timestamps: true })

export class Category extends Document{
    @Prop({default: uuid})
    categoryId: string
    @Prop()
    categoryName: string
    @Prop()
    categoryImage: string
}

export const categorySchema = SchemaFactory.createForClass(Category);