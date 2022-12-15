const shortid=require('shortid');
const validUrl=require('url-validation')
const urlModel=require('../model/urlModel')
const validator=require('validator')

const redis = require('redis')

const { promisify } = require("util");
const { Model } = require('mongoose');

//1. Connect to the redis server
const redisClient = redis.createClient(
    17771,
"redis-17771.c10.us-east-1-2.ec2.cloud.redislabs.com" , { no_ready_check: true }
,);
redisClient.auth("lUv6mXSjOJYJdTHmHgFRCXt8KUvZJfWQ", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});
//2. Prepare the functions for each command

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

// const fetchAuthorProfile = async function (req, res) {

// //3. Start using the redis commad
//   let cahcedProfileData = await GET_ASYNC(`${req.params.authorId}`)
//   if(cahcedProfileData) {
//     res.send(cahcedProfileData)
//   } else {
//     let profile = await authorModel.findById(req.params.authorId);
//     await SET_ASYNC(`${req.params.authorId}`, JSON.stringify(profile))
//     res.send({ data: profile });
//   }

// };

const shortenUrl=async function(req,res){
    try{ 
    const {longUrl}=req.body
    const urlCode=shortid.generate().toLowerCase()
      
    if(Object.keys(req.body).length==0) return res.status(400).send({status:false, message:"No data given in request body"})
    if(!longUrl) return res.status(400).send({status:false, message:"Long Url should be present"})

    if(typeof longUrl!=='string') return res.status(400).send({status:false, message:"longUrl is in wrong format"})
   if(!validator.isURL(longUrl))
   return res.status(400).send({status:false, message:"url not valid"})
    
    if(!validUrl(longUrl.trim())) return res.status(400).send({status:false, message:"Invalid Url"})

    const urlExist=await urlModel.findOne({longUrl:longUrl}).select({_id:0, __v:0})
    if(urlExist) return res.status(200).send({status:true, data:urlExist})
    else{
        const baseUrl='http://localhost:3000'
        const shortUrl=baseUrl+ '/' +urlCode
       const url=await urlModel.create({longUrl, shortUrl, urlCode})
       const data={
           longUrl:longUrl,
           shortUrl:shortUrl,
           urlCode:urlCode
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
        let cahcedProfileData = await GET_ASYNC(`${urlCode}`)
    if(cahcedProfileData){
        let jsonurl=JSON.parse(cahcedProfileData)
        let longUrl = jsonurl.longUrl
        return res.status(302).redirect(longUrl)}
        else{
  let findUrl= await urlModel.findOne({urlCode:urlCode})
  if(!findUrl) return res.status(404).send({status:false, message:"url code not found"})
  await SET_ASYNC(`${urlCode}`, JSON.stringify(findUrl)) 
  return res.status(302).redirect(findUrl.longUrl)

}}
catch(err){
    return res.status(500).send({status:false, message:err.message})
}}

module.exports={shortenUrl,getUrl}
