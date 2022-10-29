const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();

require('dotenv').config();

const MONGOURI = process.env.MONGOURL
mongoose.connect(MONGOURI , )

router.get('/everything' , async(req,res)=>{
    
})