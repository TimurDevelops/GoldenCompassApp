const mongoose = require('mongoose');
const config = require('config');
const db = process.env.mongoURI || config.get('mongoURI');

const connectDB = () => {
  mongoose.connect(db,
      {useNewUrlParser: true, useUnifiedTopology: true},
      (err) => {
        if (err) {
          console.error('Failed to connect to Database...')
          console.error(err.message);
          process.exit(1);
        } else {
          console.log('MongoDB Connected...')
        }
      }
  )
}

module.exports = connectDB;