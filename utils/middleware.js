const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('./config')

// Middlewares for filtering the incoming requests.

// If the requested endpoint isn't found.
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// Sending relevant status codes according to error types.
const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') return res.status(400).send({ error: 'malformatted id' })
  if (error.name === 'ValidationError') return res.status(400).json({ error: error.message })
  if (error.name === 'JsonWebTokenError') return res.status(401).json({ error: 'invalid token' })
  if (error.name === 'TokenExpiredError') return res.status(401).json({ error: 'token expired' })
  next(error)
}

// Separating the user token sent from the client, and including it into the request object.
const tokenGrabber = async (req, res, next) => {
  const authHeader = req.get('Authorization')

  if (authHeader && authHeader.toLowerCase().startsWith('bearer')) {
    req.token = authHeader.substring(7)
  }
  next()
}

// Verifies the user token.
const userGrabber = async (req, res, next) => {
  try {
    if (req.token) {
      const decodedToken = jwt.verify(req.token, config.TOKEN_SECRET)
      req.user = await User.findById(decodedToken.id)
    }
  } catch (error) {
    next(error)
  }
  next()
}

module.exports = { unknownEndpoint, errorHandler, tokenGrabber, userGrabber }