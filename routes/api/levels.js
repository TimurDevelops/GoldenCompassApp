const express = require('express');
const router = express.Router();

const {check, validationResult} = require("express-validator");
const Teacher = require("../../models/Teacher");
const Level = require("../../models/Level");
const Lesson = require("../../models/Lesson");
const Slide = require("../../models/Slide");

const getLevel = async (levelId) => {
  const level = await Level.findById(levelId).lean();
  const lessons = []

  for (let i = 0; i < level.lessons.length; i++) {
    const res = await getLesson(level.lessons[i]);
    lessons.push(res)
  }

  level.lessons = lessons
  return level
}

const getLesson = async (lessonId) => {
  const lesson = await Lesson.findById(lessonId).lean();
  const slides = []

  for (let i = 0; i < lesson.slides.length; i++) {
    const slide = await Slide.findById(lesson.slides[i]).lean();
    slides.push(slide)
  }

  lesson.slides = slides

  return lesson
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
      const levels = []

      for (let i = 0; i < teacher.levels.length; i++) {

        const res = await getLevel(teacher.levels[i]);
        levels.push(res)
      }

      res.json({levels});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
