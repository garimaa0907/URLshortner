const shortid = require('shortid')
const validUrl = require('url-validation')
const urlModel = require('../model/urlModel')
const redis = require('redis')
const { promisify } = require('util')

//================================Connect to the Redis Server==========================================//

const redisClient = redis.createClient(
    10802,
    "redis-10802.c93.us-east-1-3.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("CmA6YyFTgXbTznofSPxkSF8UPruLZQxZ", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

const SETEX_ASYNC = promisify(redisClient.SETEX).bind(redisClient)
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient)


//==========================================SHORTEN URL========================================================//
const shortenUrl = async function (req, res) {
    try {
        const { longUrl } = req.body
        const urlCode = shortid.generate().toLowerCase()

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "No data given in request body" })
        if (!longUrl) return res.status(400).send({ status: false, message: "Long Url should be present" })

        if (typeof longUrl !== 'string') return res.status(400).send({ status: false, message: "longUrl is in wrong format" })

        if (!validUrl(longUrl.trim())) return res.status(400).send({ status: false, message: "Invalid Url" })

        let cachedUrl=await GET_ASYNC(`${longUrl}`)
        cachedUrl=JSON.parse(cachedUrl)
        if(cachedUrl) return res.status(200).send({status:true, data:cachedUrl})
        const urlExist = await urlModel.findOne({ longUrl: longUrl }).select({ _id: 0, __v: 0 })
        await SETEX_ASYNC(`${longUrl}`, 86400, JSON.stringify(urlExist))
        if (urlExist) return res.status(200).send({ status: true, data: urlExist })
        else {
            const baseUrl = 'http://localhost:3000'
            const shortUrl = baseUrl + '/' + urlCode
            const url = await urlModel.create({ longUrl, shortUrl, urlCode })
            const data = {
                longUrl: longUrl,
                shortUrl: shortUrl,
                urlCode: urlCode
            }
            await SETEX_ASYNC(`${longUrl}`,86400, JSON.stringify(data))
            return res.status(201).send({ status: true, data: data })
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//==============================================Get URL=======================================================//
const getUrl = async function (req, res) {
    try {
        const urlCode = req.params.urlCode
        if (!shortid.isValid(urlCode)) return res.status(400).send({ status: false, message: "Invalid Url Code" })

        const cachedUrl = await GET_ASYNC(`${urlCode}`)
        if (cachedUrl) return res.status(302).redirect(JSON.parse(cachedUrl))
        else {
            const findUrl = await urlModel.findOne({ urlCode: urlCode })
            await SETEX_ASYNC(`${urlCode}`, 86400 , JSON.stringify(findUrl.longUrl))
            if (findUrl) return res.status(302).redirect(findUrl.longUrl)
            else return res.status(404).send({ status: false, message: "No Url Found" })
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { shortenUrl, getUrl }

