const express = require('express');
const router = express.Router();

const {check, validationResult} = require("express-validator");
const Teacher = require("../../models/Teacher");
const Level = require("../../models/Level");
const Lesson = require("../../models/Lesson");
const Slide = require("../../models/Slide");

const getLevel = async (levelId) => {
  const level = await Level.findById(levelId).lean();

  level.lessons = level.lessons.map(async i => await getLesson(i))

  return level
}

const getLesson = async (lessonId) => {
  const lesson = await Lesson.findById(lessonId).lean();

  lesson.slides = lesson.slides.map(async i => await getSlide(i))

  return lesson
}

const getSlide = (slideId) => {
  return Slide.findById(slideId).lean();
}

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
      const teacher = await Teacher.findOne({login}).lean();
      const levels = teacher.levels.map(async i => await getLevel(i))

      res.json({levels});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
