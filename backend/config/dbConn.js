const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MOGO_URI);
    console.log('DB connectDB');
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
