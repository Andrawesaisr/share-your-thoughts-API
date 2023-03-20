const express=require('express')
const User=require('../model/user')
const Auth=require('../middleware/auth')
const Thought=require('../model/thought')
const { updateMany } = require('../model/thought')
const router=express.Router()


// sign up =>
router.post('/user/signup',async(req,res)=>{
const email=req.body.email
const checkEmail=await User.findOne({email})

if(checkEmail){
    return res.status(400).send({'error':'this email is already used'})
}
const user = new User(req.body)
try{
    await user.save()
    const token= await user.CreateAuthenticationToken()
    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).send({'message':'singup successful!'})
}catch(e){
    res.status(400).send(e) 
}
})

// sing in =>
router.post('/user/signin',async(req,res)=>{
    try{
        const user= await User.findByCredentials(req.body.email,req.body.password);
        const token=await user.CreateAuthenticationToken()
        res.setHeader('Authorization', `Bearer ${token}`);
        res.status(200).send({'message':'signin successful!!'})
    }catch(e){
        res.status(400).send(e)
    }
})

//get profile
router.get('/user/myProfile',Auth,async(req,res)=>{
    try{
        res.send(req.user)
    }catch(e){
        res.send(e)
    }
})

// logout =>
router.post('/user/logout',Auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
           return token.token!==req.token
        })
       
        await req.user.save()
  
        res.send('logout successful!!')
  
     }catch(e){
        res.status(501).send() 
     }
})

// delete =>
router.delete('/user/delete',Auth,async(req,res)=>{
try{
    await User.findOneAndDelete({_id:req.user._id})
    await Thought.deleteMany({owner:req.user._id})

    res.status(200).send('the user has been deleted')

}catch(e){
    res.status(400).send(e)
}
})

// // update =>
router.patch('/user/update',Auth,async(req,res)=>{
    const allowed=['password','age']
    const newUpdates=Object.keys(req.body)
    const result=newUpdates.every((updates)=>allowed.includes(updates))
    if(!result){
        return res.send('the allowed updates only for your age and your password')
    }
    try{
        allowed.forEach((a)=>req.user[a]=req.body[a])
        await req.user.save()
        res.send({'after the updates':req.user})

    }catch(e){
        res.send(e) 
    }
})

module.exports=router