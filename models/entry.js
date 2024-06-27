const mongoose = require('mongoose')
const config = require('../utils/config')

// The schema for Entry documents saved in the database.

const entrySchema = mongoose.Schema({
  date: String,
  time: String,
  monthObjectKey: String,
  systolic: {
    type: Number,
    required: true
  },
  diastolic: {
    type: Number,
    required: true
  },
  pulse: {
    type: mongoose.Schema.Types.Mixed
  },
  meds: Array,
  notes: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

// Converting the objectId received from the database to string format and removing
// unnecessary fields from the object.
entrySchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Entry', entrySchema)