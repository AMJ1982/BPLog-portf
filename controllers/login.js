const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

// The controller for logging in.

// Checking if the token is expired.
loginRouter.post('/checkToken', async (req, res, next) => {
  // A jsonwebtoken is in Base64 format. Separating the latter part of the token,
  // converting it to a data buffer, and reading the token expiration value (in seconds).  
  const { token } = req.body
  const payloadBase64 = token.split('.')[1]
  const decodedJson = Buffer.from(payloadBase64, 'base64').toString()
  const exp = JSON.parse(decodedJson).exp
  res.send({ tokenExpired: Date.now() >= exp * 1000  })
})

// Login. Checking credentials and creating a token.
loginRouter.post('/', async (req, res, next) => {
  const { username, password } = req.body
  
  try {
    const user = await User.findOne({ username })
    const passwordOk = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)
    
    if (!(user && passwordOk)) return res.status(401).json({ error: 'invalid username or password'})

    const userObjectForToken = {
      username: user.username,
      id: user._id
    }

    const token = jwt.sign(
      userObjectForToken,
      config.TOKEN_SECRET,
      { expiresIn: '365d' }
    )
    
    res.send({
      token,
      name: `${user.firstName} ${user.lastName}`,
      id: user._id,
      medList: user.medList,
      lightTheme: user.lightTheme
    })
    
  } catch(e) {
    next(e)
  }
})

module.exports = loginRouter