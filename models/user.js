import mongoose from "mongoose"; // mongoose is use to create schema and model

const userSchema = mongoose.Schema({
  // use to create schema (structure) for user collection
  email: {
    type: String,
    require: true, // require must include for every thing to enter schema
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require: true,
    default: "customer",
  },
  isBlocked: {
    type: Boolean,
    require: true,
    default: false,
  },
  img: {
    type: String,
    require: true,
    default: "https://avatar.iran.liara.run/public/boy?username=Ash",
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  cart: [
    {
      productId: String,
      name: String,
      price: Number,
      image: String,
      quantity: Number,
    },
  ],
});

const User = mongoose.model("users", userSchema); // to connect to users collection
export default User; //that User go to the cotroler
