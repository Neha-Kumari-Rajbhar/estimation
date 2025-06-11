const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const cors=require('cors')
const connectToDb=require('./database/db')
const cookieParser=require('cookie-parser')
const userRoutes=require('./routes/user.route')
const geminiRoutes = require("./routes/geminiRoutes"); 



connectToDb()
const app=express()


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.send('Hello world')
})
app.use('/users',userRoutes)

// API Routes
app.use('/api', geminiRoutes);

module.exports=app