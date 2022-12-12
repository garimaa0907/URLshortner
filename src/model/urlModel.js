const mongoose=require('mongoose')

//{ urlCode: { mandatory, unique, lowercase, trim }, longUrl: {mandatory, valid url}, shortUrl: {mandatory, unique} }

const urlSchema=new mongoose.Schema({
    longUrl:{
        type:String,
        required:true,
        trim:true
    },
    shortUrl:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    urlCode:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    }
})

module.exports=mongoose.model('Url',urlSchema)