require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose=require("mongoose")
app.use(express.json())
const cors = require("cors");

app.use(cors());
const bcrypt = require('bcryptjs');
app.use(bodyParser.json());

//const mongoUrl = "mongodb+srv://ingsantana36:HoHXlhVkV7DusPsR@cluster0.o40ez.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const MONGO_HOST = process.env.MONGO_HOST || 'localhost'; 
const MONGO_URI = process.env.MONGO_URI || `mongodb://${MONGO_HOST}:27017/meanAuth`;

mongoose.connect(MONGO_URI,{
    useNewUrlParser:true,
})
.then(()=>{console.log("Connected to Database");})
.catch((e)=> console.log(e));

require("./userDetails");
app.use(cors({
    origin:"*",
}))

const User = mongoose.model("UserInfo");

app.post('/register',async(req,res)=>{

    const {fname, lname, email, password }=req.body;
    const encryptedPassword = await bcrypt.hash(password,10);
    try{
        const oldUser = await User.findOne({email: email});
        if(oldUser){
           return res.json({error:"User Exist.."});
        }
        await User.create({
            fname,
            lname,
            email,
            password:encryptedPassword,
        });
        res.send({status:"ok"});
    }
    catch(error){
        res.send({status:"error..."});
    }
});

app.post('/login',async(req,res)=>{
    const {email, password}=req.body;

    try{
        const user = await User.findOne({email: email});
      if(!user || !(await user.comparePassword(password))){
          return res.json({status:"Invalid Email/Password"});
      }
      res.send({status:"ok"});
    }catch(err){
        console.log(err);
        res.status(500).json({status:"error"});
    }
});

app.listen(80,() => {
    console.log("Server Started...!");
});
