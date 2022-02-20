const express = require('express');
const router = express.Router();

const {check, validationResult} = require("express-validator");
const Teacher = require("../../models/Teacher");
const Level = require("../../models/Level");
const Lesson = require("../../models/Lesson");
const Slide = require("../../models/Slide");


// @route    POST api/users
// @desc     Get all Lessons of a Teacher
// @access   Public
router.post(
  '/get-levels',
  check('login', 'Введите Логин Учителя').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const {login} = req.body;

    try {
      const teacher = await Teacher.findOne({login});
      const levels = await Level.find({_id: {$in: teacher.levels}})
        .populate({ path: 'lessons', model: Lesson, populate: { path: 'slides', model: Slide } }).lean();

      res.json({levels});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
