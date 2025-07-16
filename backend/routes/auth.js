import 'dotenv/config'

let code=process.env.JWT_SECRET||'1234'
console.log(code)

import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import fetchUser from '../middleware/fetchUser.js';

const router =express.Router();

router.post('/signup', async (req,res)=>{
    const {name,email,password}=req.body;
    try {
        if(!name || !email || !password){
            return res.status(400).json({error: "Please fill all the fields"});
        }

        if(!email.includes('@')){
            return res.status(400).json({error: "Please enter a valid email"});
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({error: "User already exists"});
        }
        // generate salt and hash the password
        const salt =await bcrypt.genSalt(10);
        const hashedPassword =await bcrypt.hash(password,salt);
        const newUser = await User({
            name,
            email,
            password : hashedPassword   
        })
        await newUser.save();
        console.log(newUser);
        res.status(201).json({message: "User created successfully"});

        
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal server error"});
    }
})

router.post('/login', async (req,res)=>{
    const {email,password}=req.body;
    try {
        console.log("JWT_SECRET:", code);

        if(!email || !password){
            return res.status(400).json({error: "Please fill all the fields"});
        }

        if(!email.includes('@')){
            return res.status(400).json({error: "Please enter a valid email"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "User does not exist"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({error: "Invalid credentials"});
        }

            const token = jwt.sign({ userId: user.id }, " " + code, {
                expiresIn: '7d'
            })

            res.status(201).json({ token,success:"login succesfull" })


    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal server error",error:error });
    }   
})



router.get('/getuser', fetchUser, async (req, res) => {

    try {
        const userId=req.userId;
        console.log(userId)
        const user= await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal server error"});
    }

})

export default router;