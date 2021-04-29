const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const Student = require('../../models/Student');
const Teacher = require('../../models/Teacher');

// @route    GET api/auth
// @desc     Get student by token
// @access   Private
router.get('/student', auth, async (req, res) => {
  try {
    const user = await Student.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/auth
// @desc     Get teacher by token
// @access   Private
router.get('/teacher', auth, async (req, res) => {
  try {
    const user = await Teacher.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate student & get token
// @access   Public
router.post(
  '/student',
  check('login', 'Заполните поле логин').exists(),
  check('password', 'Заполните поле пароль').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { login, password } = req.body;

    try {
      let user = await Student.findOne({ login });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Неверный логин/пароль' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Неверный логин/пароль' }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({name: user.name, login: user.login, teachers: user.teachers, token, type: 'student'});
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    POST api/auth
// @desc     Authenticate teacher & get token
// @access   Public
router.post(
  '/teacher',
  check('login', 'Заполните поле логин').exists(),
  check('password', 'Заполните поле пароль').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { login, password } = req.body;

    try {
      let user = await Teacher.findOne({ login });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Неверный логин/пароль' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Неверный логин/пароль' }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({name: user.name, login: user.login, teachers: user.teachers, token, type: 'teacher'});
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;