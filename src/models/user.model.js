import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        userrname :{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email :{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullname :{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avtar :{
            type:String,// cloudinary url
            required:true,
        
        },
        coverImage :{
            type:String,// cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password:{
            type:String,
            required:[true,'Password is required']
        },
        referToken:{
            type:String
        }

},
{
    timestamps:true
})

userSchema.pre("save",async function(next){
    if (!this.isModified("password")) return next();
    this.password =bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAcessToken = function(){
    jwt.sign({
        _id : this._id,
        email: this.email,
        userrname: this.userrname,
        fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECERT,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}
userSchema.methods.generateRefreshToken = function(){
    jwt.sign({
        _id : this._id,
    },
    process.env.REFERSH_TOKEN_SECERT,
    {
        expiresIn: process.env.REFERSH_TOKEN_EXPIRY
    }
    )
}


export const User = mongoose.model("User",userSchema)