const mongoose = require('mongoose'); 
mongoose.set('useCreateIndex', true);
const User = mongoose.Schema({
    email: {
        type:String,
        required: true,
        unique: 1
      }, 
      password:{
        type:String,
        required: true,
        minLength: 6
      }, 
      token: {
        type: String, 
        required: false
      },
      dateText: {
        type: Date, 
        default: Date.now
        
      },
      wordsNumber:{
        type: Number, 
        required: false,
        default: 0
      },
      
})


module.exports = mongoose.model("User",User)