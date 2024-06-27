require('dotenv').config()

const PORT = process.env.PORT || 3001
let MONGODB_URI = process.env.MONGODB_URI
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test')
  MONGODB_URI = process.env.TEST_MONGODB_URI
const TOKEN_SECRET = process.env.TOKEN_SECRET

module.exports = { PORT, MONGODB_URI, TOKEN_SECRET }