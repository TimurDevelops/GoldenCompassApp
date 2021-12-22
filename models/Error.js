const mongoose = require('mongoose');

const ErrorSchema = new mongoose.Schema({
  error: {
    type: String,
    required: true
  },
  componentStack: {
    type: String,
    required: false
  },
  user: {
    type: String,
    required: false
  },
  time: {type: Date, default: Date.now}
})


module.exports = Error = mongoose.model('Error', ErrorSchema);