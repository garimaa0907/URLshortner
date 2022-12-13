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