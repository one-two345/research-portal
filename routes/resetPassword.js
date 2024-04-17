import express from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'

import UserModel from '../models/users.js';
const passwordRoute=express.Router()
passwordRoute.post('/forgot',(req,res)=>{
     console.log(req.body.email,'from foget password')
     const email=req.body.email;
     UserModel.findOne({email:email})
    .then(user=>{
    if(!user){
     res.json('user not found')
    
    }
    console.log(user._id)
    const idd=user._id.toString();
    const token=jwt.sign({id:idd},'miint',{expiresIn:'1d'})
    console.log(token)
    const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: 'adaneeshete560@gmail.com',
       pass: 'xyre mtqo kpwo yexq',
     },
   });
 
   const mailOptions = {
     from: 'adaneeshete560@gmail.com',
     to:'eshetegerem@gmail.com',
     subject:'reset forgot password',
     text: `https://mint2024.netlify.app/reset/${idd}/${token}`,
   };
 transporter.sendMail(mailOptions,function(error,info){
     if(error){
         console.log(error)
 
     }
     else{
         console.log('email sent',info.response)
         res.json({message:'success'});
     }
 })
 
 
 
    })
    .catch(error=>{
     console.log(error)
    })
 })

 passwordRoute.post('/reset', async(req, res) => {
    const { id, password } = req.body;
    
    const hash = await bcrypt.hash(password, 12);

    UserModel.findByIdAndUpdate({ _id: id }, { password: hash }, { new: true }) // Using { new: true } to return the updated document
      .then(updatedUser => {
        if (!updatedUser) {
          return res.json('No user found');
        }
        console.log(updatedUser); // Log the updated user
        res.json({ message: 'sent', updatedUser }); // Send response with updated user
      })
      .catch(error => {
        console.log('Error occurred while updating password:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
  

export default passwordRoute