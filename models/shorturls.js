// Import the Mongoose library
const mongoose = require('mongoose')

// Import the ShortId library
const shortId = require('shortid')

// Define the schema for the ShortUrl model
const shortUrlSchema = new mongoose.Schema({
  // The full URL that the short URL will redirect to
  full: {
    type: String,
    required: true
  },
  // The short URL that will be generated
  short: {
    type: String,
    required: true,
    default: shortId.generate
  },
})

// Export the ShortUrl model
module.exports = mongoose.model('ShortUrl', shortUrlSchema)