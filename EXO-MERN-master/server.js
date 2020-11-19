const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path')
const { JWT_SECRET, MONGOURI } = require('./config/keys');
const requireLogin = require('./middleware/requireLogin')
const {justify} = require('./justify-functions')
const User = require('./Models/User');


//choosing the port
let PORT = process.env.PORT || 5000

// create the server 
const server = express()

// middleware definition
server.use(bodyParser.text());
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())

// conecting to the data base
mongoose.connect( MONGOURI,{ useNewUrlParser: true, useUnifiedTopology: true},(err)=>{
    if(err) return console.log(err); 
    console.log('successfully connected to the data base')
});

// create the justify API
server.post('/api/justify',requireLogin,(req,res)=>{
    //getting the data from the body of the request
    data = req.body
    //getting the infromations about the current user
  const {_id,wordsNumber,dateText} = req.user
  const dataLength =  data.split(' ').length
  const today = new Date().toString().slice(4,15)
  //if the date is not the current date the wordNumbers is going to reset to 0
  if(today != dateText.toString().slice(4,15)){
    User.updateOne({_id:_id},{wordsNumber:0}).catch(err=>console.log(err))
    User.updateOne({_id:_id},{wordsNumber: wordsNumber+dataLength}).catch(err=>console.log(err))
    data = data.replace('\n\n', '\n').trim();
    let result = justify(data, 80);
    res.send(result).status(200)
  }
  // if the current user used over 800000 word we block the operation
  else if(wordsNumber >= 80000 || wordsNumber+dataLength >= 80000){
    res.status(402).send('Payment Required')
    
 } // setting the word Number of the current user and send the justify text as a response
 else{
    User.updateOne({_id:_id},{wordsNumber: wordsNumber+dataLength}).catch(err=>console.log(err))
    data = data.replace('\n\n', '\n').trim();
    let result = justify(data, 80);
    res.send(result).status(200)
     }
 
      
})

//creating the signUp API to create users in our database
server.post('/api/signup', (req, res) =>{
    // getting the email and the password from the body of the request
    const {email, password} = req.body; 
    // check if the email or the password is missing
    if( !email || !password){
      return res.status(400).json({error: "Please verify your data"})
    }
    else{
        User.findOne({email:email}).then((savedUser)=>{
            if(savedUser){
             return res.status(422).json({error: "User already exist"})
            }
            bcrypt.hash(password,12)
            .then(hasedPassword =>{
                const user = new User({email: email, password: hasedPassword});
                //registering the user in the database with a hashed password
                user.save().then((user)=>res.status(200).json({message: "you're account was successfully created"}))
                .catch((err)=>{res.json({message: "geting error while creating the usere"})})
            }).catch(err=> res.json({error:'getting error while creating the user'}))
        })
    }

})

//creating the token genrater API
server.post('/api/token', (req, res) =>{
        // getting the email and the password from the body of the request
    const { email , password } = req.body; 
     // check if the email or the password is missing
    if(!email || !password){
       return res.status(422).json({error: "please provide email or password"})
    }
     User.findOne({email: email}).then(savedUser=>{
        if(!savedUser){
            return  res.status(422).json({error: "invalid user data please try again"})
              }
        bcrypt.compare(password, savedUser.password)
         .then(doMatch =>{
             if(doMatch){
                 //generate the token for the current user
             const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
             User.updateOne({_id: savedUser._id},{token:token}).catch(err=>console.log(err))
             res.json({token})
             }
         else{
            return res.status(400).json({error:"invalid password please try again"})
         }
         })
 
     })
     .catch(err=> res.send(err))
 })



 if(process.env.NODE_ENV=="production"){
    server.use(express.static('front/build'))
    server.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'front','build','index.html'))
    })   
}

server.listen(PORT,(err)=>{
    if(err){
        console.log(err)
    }
    else 
    console.log(`server is running on ${PORT}`)
})