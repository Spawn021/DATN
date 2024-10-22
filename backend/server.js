const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

require('dotenv').config()
const dbconnect = require('./config/dbconnect')
const initRoutes = require('./routes')

const app = express()
app.use(
   cors({
      origin: process.env.CLIENT_URL,
      methods: ['POST', 'PUT', 'GET', 'DELETE'], // allow only these methods to be used by client to access this server
      credentials: true, // enable set cookie (for token), res.header('Access-Control-Allow-Credentials', true)
   }),
)
app.use(cookieParser())
const port = process.env.PORT || 8888
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
dbconnect()

initRoutes(app)
app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`)
})
