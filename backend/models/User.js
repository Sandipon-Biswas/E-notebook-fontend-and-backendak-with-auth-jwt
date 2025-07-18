import mongoose from "mongoose";
const { Schema,model } = mongoose;

const UserSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

const User= model('user',UserSchema);
User.createIndexes();
export default User;
// module.exports = mongoose.model('user',UserSchema);