const express=require('express')
const Thought=require('../model/thought')
const Auth=require('../middleware/auth')

const router =express.Router()


// add => 
router.post('/thought/add',Auth, async(req,res)=>{
    const now=new Date()
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
const thought=new Thought({
    ...req.body,
    publishTime:now.toLocaleDateString('en-us', options),
    owner:req.user._id
})
try{
    await thought.save()
    res.status(200).send(thought)
}catch(e){
    res.send(e)
}
})

// // delete =>
router.delete('/thought/delete/:id',Auth,async(req,res)=>{
    const id=req.params.id
    try{
        const thought= await Thought.findOne({_id:id,owner:req.user._id})
        if(!thought){
            return res.send({'error':"the id is wrong Or it's not yours"})
        }
        res.send({'this thought has been deleted':thought})
    }catch(e){
        res.send(e)
    }
})

// get mine =>
router.get('/thought/mine',Auth,async(req,res)=>{
    try{
        await req.user.populate({path:'thoughts'})
        res.send(req.user.thoughts)
    }catch(e){
        res.send(e)
    }
})

// gell all =>
router.get('/thoughts/all',async(req,res)=>{
    try{
        const allThoughts=await Thought.find()
        res.send(allThoughts)
    }catch(e){
        res.send(e)
    }
})

module.exports=router