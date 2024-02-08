import mongoose,{Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber :{
        type:Schema.type.ObjectID,
        ref: "User"
    },
    channel:{
        type:Schema.type.ObjectID,
        ref:"User"
    }
},{timestamps:true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)