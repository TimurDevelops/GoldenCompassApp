const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

const Slide = require('../../models/Slide');
const Lesson = require('../../models/Lesson');

// @route    POST api/slides
// @desc     Add lesson
// @access   Public
router.post(
  '/',
  check('lessonId', 'Выберите урок').notEmpty(),
  check('img', 'Выберите изображение').notEmpty(),
  check('tip', 'Укажите посказку для учителя').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {lessonId, img, tip} = req.body;

    try {
      let slide = await Slide.findOne({name});

      if (slide) {
        return res
          .status(400)
          .json({errors: [{msg: 'Урок с таким названием уже существует'}]});
      }

      slide = new Slide({
        img,
        tip
      });

      let lesson = await Slide.findOne({name});

      if (!lesson) {
        await slide.delete()
        return res
          .status(404)
          .json({errors: [{msg: 'Указанного урока не существует'}]});
      }

      await Lesson.updateOne({ _id: lessonId }, { slides: [...lesson.slides, slide._id] });

      await slide.save();

      res.json({msg: 'Урок создан'});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);


module.exports = router;