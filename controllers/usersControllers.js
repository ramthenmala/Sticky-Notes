const User = require('../models/Users');
const Notes = require('../models/Notes');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// @desc    Get all users
// @route   GET /users
// @access  PRIVATE
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean();

  if (!users) {
    return res.status(400).json({ message: 'No Users Found' });
  }
  return res.status(200).json(users);
});

// @desc    Create new user
// @route   POST /user
// @access  PRIVATE
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: 'All fields must be included' });
  }

  // check for duplicate
  const duplicate = await roles.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(400).json({ message: 'User Name already in use' });
  }

  const hashPassword = await bcrypt.hashSync(password, 10);
  const userObject = { username, password: hashPassword, roles };

  const user = await User.create(userObject);

  if (user) {
    return res
      .status(200)
      .json({ message: `New user with name ${username} created` });
  } else {
    return res.status(400).json({ message: `Unable to create New User` });
  }
});

// @desc    Update User
// @route   PATCH /user
// @access  PRIVATE
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, roles, active } = req.body;

  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== 'boolean'
  ) {
    return res.status(400).json({ message: `All fields are required` });
  }

  const user = await User.findById(id).exec()

  if(!user) {
    return res.status(400).json({ message: `Cant find User`})
  }

  
});

// @desc    Delete User
// @route   DELETE /user
// @access  PRIVATE
const deleteUser = asyncHandler(async (req, res) => {});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
