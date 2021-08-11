const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');

const Student = require('../../models/Student');
const Teacher = require('../../models/Teacher');


// @route    POST api/users
// @desc     Get all Students of a Teacher
// @access   Public
router.post(
  '/get-students',
  check('teacherLogin', 'Введите Логин Учителя').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {teacherLogin} = req.body;

    try {
      let teacher = await Teacher.findOne({login: teacherLogin});

      if (!teacher) {
        return res
          .status(404)
          .json({errors: [{msg: 'Учитель с таким логином отсутствует'}]});
      }
      const ObjectId = require('mongoose').Types.ObjectId;

      const students = await Student.find({teachers: ObjectId(teacher._id)});

      return res.json({students});

    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

// @route    POST api/teacher
// @desc     Get set password of a teacher
// @access   Public
router.post(
  '/set-password',
  check('teacherLogin', 'Введите Логин Учителя').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const {login, oldPassword, password} = req.body;

    try {
      let user = await Teacher.findOne({login});
      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({errors: [{msg: 'Неверный пароль'}]});
      }

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.json({user});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
