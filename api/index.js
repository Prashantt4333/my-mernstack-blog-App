const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRouter = require('./routes/user.route.js');
const authRoutes = require('./routes/auth.route.js')
const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

dotenv.config()
mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log('MongoDb is Connected')
})
.catch((err)=>{
    console.log(err)
})

app.listen(port, () => {
  console.log(`Server is running on port  ${port}`)
})

app.use('/api/user', userRouter)
app.use('/api/auth', authRoutes)

app.use((err,req,res,next)=>{
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success :false,
    statusCode,
    message
  })

})