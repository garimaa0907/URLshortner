const shortid=require('shortid')

const urlModel=require('../model/urlModel')

const baseUrl='http://localhost:3000'

const shortenUrl=async function(req,res){
    try{ 
    const {longUrl}=req.body
    const urlCode=shortid.generate().toLowerCase()

    if(Object.keys(req.body).length==0) return res.status(400).send({status:false, message:"No data given"})
    if(!longUrl) return res.status(400).send({status:false, message:"Long Url should be present"})

    if(typeof longUrl!=='string') return res.status(400).send({status:false, message:"longUrl should be in string format"})
    

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



module.exports={shortenUrl}