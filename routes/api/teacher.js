const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

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

module.exports = router;


