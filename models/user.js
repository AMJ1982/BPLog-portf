const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// The schema for User documents saved in the database.

const userSchema = mongoose.Schema({
    username: {
      type: String,
      unique: true
    },
    passwordHash: String,
    firstName: String,
    lastName: String,    
    birthYear: Number,
    height: Number,
    weight: Number,
    medList: Array,
    lightTheme: Boolean
  })
  
  // Converting the objectId received from the database to string format and removing
  // unnecessary fields from the object.
  userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      delete returnedObject.passwordHash
    }
  })

  userSchema.plugin(uniqueValidator)
  
  module.exports = new mongoose.model('User', userSchema)