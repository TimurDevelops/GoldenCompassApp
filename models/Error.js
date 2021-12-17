const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  error: {
    required: true
  },
  componentStack: {
    required: false
  },
  user: {
    required: true
  },
  time: {type: Date, default: Date.now}
})


module.exports = Lesson = mongoose.model('Error', LessonSchema);