/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
export const CategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'You must put the category name'],
        minLength:3,
        maxLength:30,
        unique:true
    },
    image:String
},{
    timestamps:true
}); 