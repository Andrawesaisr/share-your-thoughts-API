const jwt=require('jsonwebtoken')
const User=require('../model/user')

const Auth=async function(req,res,next){
try{
    const token = req.header('Authorization').replace('Bearer ','')
    const decode= jwt.verify(token,'myProject')
    const user= await User.findOne({_id:decode._id,'tokens.token':token})
    if(!user){
        throw new Error()
    }
    req.user=user
    req.token=token
    next()
}catch(e){
    res.send({'error':'Please authenticate'})
}
}


module.exports=Auth