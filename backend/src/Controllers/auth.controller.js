import User from "../Models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signup=async (req,res)=>
{ 
  const {username,email,password}=req.body; 
  if (await User.findOne({username})){

    return res.status(400).json({
      message:"username already exists"
    })
  }
  if (await User.findOne({email}))
  {
    return res.status(400).json({
      message:"user with this email already exists"
    })
  }
  try{

    const saltrounds=10;

    const hashpassword=await bcrypt.hash(password,saltrounds);

    const newuser= new User({
    email,
    username,
    password:hashpassword
  });
   if(newuser)  
   {
    generateToken(newuser._id,res);

    await newuser.save();

     return res.status(201).json({
        _id:newuser._id,
        email:newuser.email,
        username:newuser.username,
        profile_pic:newuser.profile_pic
    })
}
    else
        {
        return res.status(400).send("inputs are not valid");
     }

    }

    catch{
        console.log("internal error occurs check out once");
        return res.status(400).send(err.message);
        
    }
}
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User with this email does not exist!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    generateToken(user._id, res);

   
    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "Development",
      sameSite: "strict", 
    });
    console.log("at logout");
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("error occurred", err.message);
    res.status(500).send("internal server error");
  }
};

/*
export const updateprofile = async (req, res) => {
  try {
    const { profile_pic } = req.body;  
    const userId = req.user._id;

    console.log(profile_pic)

    if (!profile_pic) {
      return res.status(400).send("No image provided");
    }

   
    const uploadResponse = await cloudinary.uploader.upload(profile_pic, {
      folder: "GO_CHAT",
    });

    console.log(uploadResponse);


    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profile_pic: uploadResponse.secure_url },
      { new: true,select:"-password" }
    );
    console.log(profile_pic)

    if (!updatedUser) {
      return res.status(500).send("User not found");
    }

    res.status(200).json(
      updatedUser
    );
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).send("Server error");
  }
};*/
export const checkauth=(req,res)=>
  {
    console.log("auth fetched successfully");
      try{
         res.json(
            req.user
          )
        console.log(req.user);
      }
      catch(err)
      {
        res.status(401).send("not authorized");
      }
  }