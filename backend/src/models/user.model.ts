import mongoose from "mongoose";
import bcrypt from "bcrypt"
export interface UserDocument extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(value:string): Promise<boolean>
}


const userSchema = new mongoose.Schema <UserDocument>({
    username : { type:String ,required:true},
    email : { type:String ,required:true, unique:true},
    password : { type:String ,required:true},
    verified:{ type:Boolean, required:true, default:false}
},{
    timestamps:true
})

userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        return next()
    }

    this.password = await bcrypt.hash(this.password,12)
    return next()

})

userSchema.methods.comparePassword = async function (value:string){
    return bcrypt.compare(value, this.password).catch(()=>false);
}

const UserModel = mongoose.model<UserDocument>("User",userSchema)
export default UserModel


