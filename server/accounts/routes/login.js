const express = require('express');
var router=express.Router();

const User = require('../model/UserSchema')
var mongoose = require('mongoose');
var userDB = mongoose.createConnection('mongodb://127.0.0.1:27017/user');

//用户注册
router.post('/register',async function(req,res,next){
    try{
        const {username,password} = req.body;
        if(!username||!password){
            return res.json({message:'用户名或密码不能为空'})
        }
        const existUser = await User.findOne({username});
        if(existUser){
            return res.json({message:'用户已注册'})
        }else{
            const newUser = new User({username,password});
            await newUser.save();
            return res.json({message:'注册成功'});
        }
    }catch(error){
        console.log(error);
    }
})
//用户登陆
router.post('/login',async function(req,res,next){
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.json({message:'用户名不存在'});
        }else if(password!==user.password){
            return res.json({message:'密码不正确'});
        }else{
            return res.json({message:'登陆成功'})
        }

    }catch(error){
        console.log(error);
    }
})
  
module.exports=router;