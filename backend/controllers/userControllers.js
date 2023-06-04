import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
//public
const authUser = asyncHandler(async(req,res)=>{
    const { email, password} = req.body;
    const user = await User.findOne({email})
    if(user && (await user.matchPasswords(password))){
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    } else{
        res.status(401);
        throw new Error('Invalid email or password')
    }
})
//public
const registerUser = asyncHandler(async(req,res)=>{
    const { name, email, password} = req.body;
    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400);
        throw new Error('User already exists')
    }
    const user = await User.create({
        name,email,password
    })
    if(user){
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    } else{
        res.status(400);
        throw new Error('Invalid user data')
    }
})
//public
const logoutUser = asyncHandler(async(req,res)=>{
    res.clearCookie('jwt')
    res.status(200).json({message:"deleted"})
})
//private
const getUserProfile = asyncHandler(async(req,res)=>{
    
    const user = await User.findById(req.user._id);

    res.status(200).json({message:req.user._id})
})
//private
const updateUserProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id)
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        const updatedUser = await user.save();
        res.status(200).json({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
        })
    } else {
        res.status(404)
        throw new Error('user not found')
    }
})





export{
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
}