import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            require: [true, "Name is required"],
            trim: true,
        },
        email:{
            type:String,
            required: [true,"Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/,"Please provide a valid email"]
        },
        password:{
            type: String,
            required: [true,"Password is required"],
            minLength:[6,"Password must be atleast 6 character long"],
            select: false,
        },
        role:{
            type: String,
            enum: ["owner","member"],
            default: "owner",
        },
        company:{
            type:String,
            trim: true,
            default: "",
        },
        avatar:{
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
)

// Hash new or updated passwords before saving.
userSchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});


//method to compared the user entered password with the stored hashed password
userSchema.methods.matchPassword = function (entered){
    if (!/^\$2[aby]\$\d{2}\$/.test(this.password)) {
        return Promise.resolve(entered === this.password);
    }
    return bcrypt.compare(entered, this.password);
};

export const User = mongoose.model("User", userSchema)