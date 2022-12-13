const express=require('express')
const mongoose=require('mongoose')
const app=express()
const route=require('./routes/route')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

mongoose.set('strictQuery', false)
mongoose.connect('mongodb+srv://UrlShortner:UrlShortner@cluster0.nj2ofna.mongodb.net/group2Database',
 {useNewUrlParser:true}) 
 .then(()=>console.log("MongoDb is connected"))
 .catch(err=>console.log(err.message))

 app.use('/',route)

app.listen(process.env.PORT || 3000, function(){
    console.log("Express is running on port " + (process.env.PORT || 3000))
})
