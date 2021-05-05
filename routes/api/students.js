const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

const Student = require('../../models/Student');
const Teacher = require('../../models/Teacher');

// @route    POST api/student
// @desc     Register user
// @access   Public
router.post(
  '/',
  check('name', 'Введите ФИО').notEmpty(),
  check('login', 'Введите Логин').notEmpty(),
  check(
    'password',
    'Пароль не может быть короче 6 символов'
  ).isLength({min: 6}),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {name, login, password} = req.body;

    try {
      let user = await Student.findOne({login});

      if (user) {
        return res
          .status(400)
          .json({errors: [{msg: 'Пользователь с таким огином уже зарегистрирован'}]});
      }

      user = new Student({
        name,
        login,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {expiresIn: '5 days'},
        (err, token) => {
          if (err) throw err;
          res.json({token});
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/assign-teacher',
  check('teacherLogin', 'Введите Логин Учителя').notEmpty(),
  check('studentLogin', 'Введите Логин Ученика').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {teacherLogin, studentLogin} = req.body;

    try {
      let student = await Student.findOne({login: studentLogin});
      let teacher = await Teacher.findOne({login: teacherLogin});

      if (!student) {
        return res
          .status(404)
          .json({errors: [{msg: 'Ученик с таким логином отсутствует'}]});
      }
      if (!teacher) {
        return res
          .status(404)
          .json({errors: [{msg: 'Учитель с таким логином отсутствует'}]});
      }

      if (student.teachers.find(teach => teach.toString() === teacher._id.toString())) {
        return res
          .status(404)
          .json({errors: [{msg: 'Данный Учитель уже закреплен за данным учеником'}]});
      }
      await Student.updateOne({ _id: student._id }, { teachers: [...student.teachers, teacher._id] });
      return res.json({msg: 'Учитель закреплен за учеником'});

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

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


module.exports = router;


