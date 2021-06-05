const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slides: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Slides' }],
})


module.exports = Lesson = mongoose.model('Lesson', LessonSchema);