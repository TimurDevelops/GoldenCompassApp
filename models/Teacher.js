const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  login: {
    type: String,
    required: true
  },
  password:  {
    type: String,
    required: true
  },
})


module.exports = Teacher = mongoose.model('Teacher', TeacherSchema);