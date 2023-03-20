const mongoose =require('mongoose')

const thoughtSchema =new mongoose.Schema({
    about:{
        type:String,
        required:true,
        trim:true,
        maxLength:20
    },
    myThought:{
        type:String,
        required:true,
        trim:true
    },
    publishTime:{
        type:String
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
})



const Thought = mongoose.model('Thought',thoughtSchema)

module.exports=Thought