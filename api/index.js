const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()
mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log('MongoDb is Connected')
})
.catch((err)=>{
    console.log(err)
})
const express = require('express')
const app = express()
const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port, () => {
  console.log(`Server is running on port  ${port}`)
})