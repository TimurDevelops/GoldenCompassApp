const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

const Lessons = require('../../models/Lesson');

// @route    POST api/lesson
// @desc     Add lesson
// @access   Public
router.post(
  '/',
  check('name', 'Введите Название Урока').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {name} = req.body;

    try {
      let lesson = await Lessons.findOne({name});

      if (lesson) {
        return res
          .status(400)
          .json({errors: [{msg: 'Урок с таким названием уже существует'}]});
      }

      lesson = new Lessons({
        name
      });

      await lesson.save();

      res.json({msg: 'Урок создан'});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);


module.exports = router;
