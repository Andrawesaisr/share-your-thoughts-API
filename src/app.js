const express= require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const userRouter=require('./router/users')
const thoughtRouter=require('./router/thoughts')
const app =express()

app.use(express.json());
app.use(userRouter)
app.use(thoughtRouter)










// async function adding(){
//     try{
//         const user =new User({
//             name:'andrew',
//             email:'bebo@gmail.com',
//             password:'meandyoutogether',
//             age:24
//         })
//         await user.save()
//     }catch(e){
//         console.log(e)
//     }
// }
// adding()




const uri='mongodb+srv://andrew:password111@cluster0.k1lrhbw.mongodb.net/andrew'
 mongoose.connect(uri,{
            useUnifiedTopology:true,
            useNewUrlParser: true
        })
app.listen(3000,()=>{
    console.log('server is up on port 3000')
})