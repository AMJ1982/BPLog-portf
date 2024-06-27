const express = require('express')
const mongoose = require('mongoose')
const app = express()
const helmet = require('helmet')
const path = require('path')
const cors = require('cors')
const entriesRouter = require('./controllers/entries')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const config = require('./utils/config')

// Setting up the database connection.
mongoose.connect(config.MONGODB_URI)
  .then(res => console.log('Connected to MongoDB'))
  .catch(error => console.log('Connection error: ', error.message))

app.use(helmet())
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.tokenGrabber)
app.use(middleware.userGrabber)
app.use('/api/entries', entriesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
// If client refreshes page in an url defined by React Router, browser makes a server request
// to that path. Since these routes aren't defined on the server, the index page is sent to client.
// This provides the needed JavaScript to browser for React Router to care of the rest.
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app