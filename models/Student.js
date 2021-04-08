const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
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
  teachers: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
})


module.exports = Student = mongoose.model('Student', StudentSchema);