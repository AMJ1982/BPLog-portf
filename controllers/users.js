const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

// The controller for user management.

// Fetching a user by user id.
usersRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const data = await User.findById(id)
    res.json(data)
  } catch (exception) {
    next(exception)
  }
})

// Creating a new user.
usersRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body

    // A simple validation for password.
    if (!body.password || body.password.length < 6) {
      res.status(400).json({ error: 'Password too short or missing'})
    }

    // Creating a hashed version of the password before storing it into the database.
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    
    const newUser = new User({
      username: body.username,
      passwordHash,
      firstName: body.firstName,
      lastName: body.lastName,
      birthYear: body.birthYear,
      height: body.height,
      weight: body.weight,
      medList: body.medList,
      lightTheme: false
    })
    const createdUser = await newUser.save()
    res.json(createdUser)
  } catch (exception) {
    next(exception)
  }
})

// Updating user information.
usersRouter.put('/:id', async (req, res, next) => {
  const body = req.body
  try {
    const user = req.user
    if (!user) return res.status(401).json({ error: 'Authorization failed' })
    const updatedUser = await User.findByIdAndUpdate(req.params.id, body, { new: true })
    res.json({
      name: `${updatedUser.firstName} ${updatedUser.lastName}`,
      id: updatedUser._id,
      medList: updatedUser.medList,
      lightTheme: updatedUser.lightTheme ? updatedUser.lightTheme : false
    })
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter