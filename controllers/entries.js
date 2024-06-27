// The controller for data related operations.

// Creating a designated Express router for entry related endpoints.
const entriesRouter = require('express').Router()
const Entry = require('../models/entry')
const jwt = require('jsonwebtoken')

// Fetching all entries of the user.
entriesRouter.get('/', async (req, res, next) => {
  const userId = req.query.userId
  try {
    const entries = await Entry.find({ user: userId })
    res.json(entries)
  } catch (exception) {
    next(exception)
  }  
})

// Saving a new entry to the database.
// The new entry and authorized user are received with request object.
entriesRouter.post('/', async (req, res) => {
  const user = req.user
  if (!user) return res.status(401).json({ error: 'Authorization failed' })
  
  const entry = new Entry({
    ...req.body,
    user: user._id
  })
  
  const savedEntry = await entry.save()
  res.json(savedEntry)
})

// Updating an existing entry.
entriesRouter.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const modifiedEntry = req.body
    const updatedEntry = await Entry.findByIdAndUpdate(id, modifiedEntry, { new: true })
    res.json(updatedEntry)
  } catch (exception) {
    next(exception)
  }
})

// Deleting an entry.
entriesRouter.delete('/:id', async (req, res, next) => {  
  const entryId =  req.params.id
  const token = req.token
  const decodedToken = jwt.decode(token, process.env.SECRET)

  if(!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token error' })
  }
  
  try {
    const entryToDelete = await Entry.findById(entryId)
    
    if(entryToDelete.user.toString() !== decodedToken.id) {
      return res.status(401).json({ error: 'user not authorized to delete this document' })
    }
    
    await Entry.findByIdAndDelete(entryId)
    res.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

module.exports = entriesRouter