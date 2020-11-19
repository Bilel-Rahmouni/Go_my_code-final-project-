const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const User = require('../Models/User')

module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    if(!authorization){
       return res.status(401).json({error:"you must be logged in"})
    }
    const token = authorization
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
         return   res.status(401).json({error:"you must be logged in"})
        }

        const {_id} = payload
        User.findById(_id).then(userdata=>{
            req.user = {_id: userdata._id,wordsNumber: userdata.wordsNumber, dateText: userdata.dateText} 
            next()
        })  
        
    })
}