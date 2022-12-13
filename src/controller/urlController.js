// const urlModel=require('../model/urlModel')
// const shortId= require('shortid')
// //const validUrl= require('valid-url') 

// const baseUrl= "http://localhost:3000"

// const createUrl = async function(req,res){
// try{
//    let { longUrl }= req.body 
//    let urlCode= shortId.generate()
//    if(!longUrl)
// return res.status(400).send({status:false , message: "enter long url "})
//   let dataa = await urlModel.findOne({longUrl})
//   if(dataa)
//   return res.status(400).send({status:true, data : data}) 
//   let shortUrl = baseUrl + "/" + urlCode
// let   creat={
//     longUrl: longUrl,
//     shortUrl : shortUrl,
//     urlCode: urlCode

// }
//  let data = await urlModel.create(creat)
// return res.status(201).send({status:true,data:data})

// }
// catch(err){
//   return res.status(500).send({status:false, message: err.message})
// }
// }

// const getUrl = async function(req, res){
//     try{
//         let urlCode = req.params.urlCode
//         let code= await urlModel.findOne({urlCode})
//         if(code){
//     return res.status(302).redirect(code.longUrl)}
//     else{
//      return res.status(404).send({status:false,message:"no document exist for this code"})}
//     }
//    catch(err){
//     return res.status(500).send({status:false, message :err.message})
//    }
// }

// module.exports={ createUrl , getUrl }
const shortid=require('shortid')
const validUrl=require('url-validation')
const urlModel=require('../model/urlModel')

const baseUrl='http://localhost:3000'

const shortenUrl=async function(req,res){
    try{ 
    const {longUrl}=req.body
    const urlCode=shortid.generate().toLowerCase()

    if(Object.keys(req.body).length==0) return res.status(400).send({status:false, message:"No data given in request body"})
    if(!longUrl) return res.status(400).send({status:false, message:"Long Url should be present"})

    if(typeof longUrl!=='string') return res.status(400).send({status:false, message:"longUrl is in wrong format"})
    
    if(!validUrl(longUrl.trim())) return res.status(400).send({status:false, message:"Invalid Url"})

    const urlExist=await urlModel.findOne({longUrl:longUrl}).select({_id:0, __v:0})
    if(urlExist) return res.status(200).send({status:true, data:urlExist})
    else{
        const shortUrl=baseUrl+ '/' +urlCode
        const url=await urlModel.create({longUrl,shortUrl,urlCode})
        const data={
            longUrl:url.longUrl,
            shortUrl:url.shortUrl,
            urlCode:url.urlCode
        }
        return res.status(201).send({status:true, data:data})
    }

}
catch(err){
    return res.status(500).send({status:false, message:err.message})
}
}



const getUrl=async function(req,res){
    try{ 
    const urlCode=req.params.urlCode
    if(!shortid.isValid(urlCode)) return res.status(400).send({status:false, message:"Invalid Url Code"})

    const findUrl=await urlModel.findOne({urlCode:urlCode})
    if(findUrl) return res.status(302).redirect(findUrl.longUrl)
    else return res.status(404).send({status:false, message:"No Url Found"})

}
catch(err){
    return res.status(500).send({status:false, message:err.message})
}
}

module.exports={shortenUrl,getUrl}
