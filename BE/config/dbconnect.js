const { default: mongoose } = require('mongoose')
const dbconnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {})
    if (conn.connection.readyState === 1) {
      console.log('Database connection successful')
    } else {
      console.log('Database connecting...')
    }
  } catch (error) {
    console.log('Database connection failed')
    throw new Error(error)
  }
}

module.exports = dbconnect
