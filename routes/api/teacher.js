const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

const Student = require('../../models/Student');
const Teacher = require('../../models/Teacher');

// @route    POST api/users
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
      let user = await Teacher.findOne({login});

      if (user) {
        return res
          .status(400)
          .json({errors: [{msg: 'Пользователь с таким огином уже зарегистрирован'}]});
      }

      user = new Teacher({
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
      console.log(students)

      // const teachers_ids = student.teachers.map(function(id) { return ObjectId(id); });

      return res.json({students});

    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);


module.exports = router;


