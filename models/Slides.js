const mongoose = require('mongoose');

const SlideSchema = new mongoose.Schema({
  img: {
    type: String,
    required: true
  },
  tip: {
    type: String,
    required: true
  },
})


module.exports = Slide = mongoose.model('Slide', SlideSchema);