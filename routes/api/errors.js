const express = require('express');
const router = express.Router();

const Error = require("../../models/Teacher");


// @route    POST errors
// @desc     Post an error
// @access   Public
router.post(
  '/',
  async (req, res) => {
    const {error, componentStack, user} = req.body;

    try {
      const savedError = new Error({
        error: typeof error === 'object' ? JSON.stringify(error) : error,
        componentStack: typeof componentStack === 'object' ? JSON.stringify(componentStack) : componentStack,
        user: typeof user === 'object' ? JSON.stringify(user) : user,
      });

      await savedError.save();

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
