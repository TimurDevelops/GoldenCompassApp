const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

const Student = require('../../models/Student');
const Teacher = require('../../models/Teacher');
const bcrypt = require("bcryptjs");


// @route    POST api/users
// @desc     Get all Teachers of a Student
// @access   Public
router.post(
  '/get-teachers',
  check('studentLogin', 'Введите Логин Ученика').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {studentLogin} = req.body;

    try {
      let student = await Student.findOne({login: studentLogin});

      if (!student) {
        return res
          .status(404)
          .json({errors: [{msg: 'Ученик с таким логином отсутствует'}]});
      }
      const ObjectId = require('mongoose').Types.ObjectId;

      const teachers_ids = student.teachers.map(function(id) { return ObjectId(id); });
      const teachers = await Teacher.find({_id: {$in: teachers_ids}});

      return res.json({teachers});

    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

// @route    POST api/students
// @desc     Get set password of a student
// @access   Public
router.post(
  '/set-password',
  check('studentLogin', 'Введите логин ученика').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const {login, oldPassword, password} = req.body;

    try {
      let user = await Student.findOne({login});
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


