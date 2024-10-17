const mongoose = require('mongoose')
import { type } from './../../node_modules/raw-body/index.d';
import { Timestamp } from './../../node_modules/bson/src/timestamp';

const userSchema = new mongoose.Schema({
    username :{
        type:String,
        required : true,
        unique: true
    },
    email:{
        type:String,
        required : true,
        unique: true
    },
    password:{
        type:String,
        required : true,
    }
}, {timestamps:true})

const User = mongoose.model('User',userSchema);

export default model;