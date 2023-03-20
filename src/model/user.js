const mongoose =require('mongoose')
const validator =require('validator')
const Thought=require('./thought')
const jwt =require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String,
        trim:true
    },
    email:{
        required:true,
        type:String,
        trim:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ('Email is invalid')
            }
        }
    },password:{
        required:true,
        type:String,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('not allowed to enter password !!')
            }
        }
    },age:{
        type:Number,
        required:true
    },tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

userSchema.virtual('thoughts',{
    ref:'Thought',
    localField:'_id',
    foreignField:'owner'
})

userSchema.statics.findByCredentials=async function(email,password){
    const user = User.findOne({email})
    if(!user){
        throw new Error('can not find this email!!')
    }

    if(!user.password===password){
        throw new Error('password is incorrect')
    }
    return user
}


userSchema.methods.CreateAuthenticationToken= async function(){
        const user = this
        const token = jwt.sign({_id:user._id.toString()},'myProject',{ expiresIn: '12h' })
        user.tokens=user.tokens.concat({token})
        await user.save()
        return token
}

userSchema.methods.toJSON=function(){
     const user=this
     const userObject=user.toObject()
     return userObject
 }
 userSchema.pre('remove',async function(next){
    const user =this
    await Thought.deleteMany({owner:user._id})
    
    next()
    })

const User = mongoose.model('User',userSchema)

module.exports=User