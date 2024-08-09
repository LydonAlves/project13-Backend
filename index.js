require("dotenv").config()
const express = require("express")
const { connectDB } = require("./src/config/db")
const mainRouter = require("./src/api/routes/mainRouter")
const cors = require('cors')
const app = express()

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`)
  next()
})

app.use(express.json())

connectDB()

// // const corsOptions = {
// //   origin: 'https://project13-frontend.vercel.app',
// //   methods: ['GET', 'PUT', 'POST', 'DELETE']
// // };

// // app.use(cors(corsOptions))

//* use below for local network, and above for vercel
app.use(cors())

app.use('/api/v1', mainRouter)

app.use("*", (req, res, next) => {
  return res.status(404).json("Route not found")
})

app.listen(3000, () => {
  console.log("http://localhost:3000");
})

