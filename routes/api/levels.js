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
      // const levels = await Level.find({_id: {$in: teacher.levels}}).populate({ path: 'lessons', model: Lesson, populate: { path: 'slides', model: Slide } }).lean();
      const levels = await Level.find({_id: {$in: teacher.levels}}).lean();

      res.json({levels});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    POST api/users
// @desc     Get all Lessons
// @access   Public
router.post(
  '/get-lessons',
  check('level', 'Введите Уровень').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const {level} = req.body;

    try {
      const levelObject = await Level.findOne({_id: level});
      const lessons = await Lesson.find({_id: {$in: levelObject.lessons}}).lean();

      res.json({lessons});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    POST api/users
// @desc     Get all Lessons
// @access   Public
router.post(
  '/get-slides',
  check('lesson', 'Введите Урок').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const {lesson} = req.body;

    try {
      const lessonObject = await Lesson.findOne({_id: lesson});
      const slides = await Slide.find({_id: {$in: lessonObject.slides}}).lean();

      res.json({slides});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
