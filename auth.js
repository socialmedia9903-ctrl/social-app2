
const express=require("express");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User=require("../models/User");
const router=express.Router();

router.post("/register",async(req,res)=>{
const {username,password}=req.body;
const hash=await bcrypt.hash(password,10);
const user=await User.create({username,password:hash});
res.json(user);
});

router.post("/login",async(req,res)=>{
const {username,password}=req.body;
const user=await User.findOne({username});
if(!user) return res.status(400).json({msg:"User not found"});
const match=await bcrypt.compare(password,user.password);
if(!match) return res.status(400).json({msg:"Wrong password"});
const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
res.json({token,username:user.username});
});

module.exports=router;
