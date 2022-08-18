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
  console.log(req.body)
  const { username, password, roles } = req.body;

  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: 'All fields must be included' });
  }

  // check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();

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

  // Check for Duplicate
  const duplicate = await User.findOne({ username }).lean().exec()
  // Allow updates to the Original User
  if(duplicate && duplicate?._id.toString() !== id){
    return res.status(409).json({
      message: 'Duplicate Username'
    })
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if(password){
    user.password = await bcrypt.hash(password, 10)
  }

  const updatedUser = await user.save()
  res.json({ message: `${updatedUser.username} Updated`})
});

// @desc    Delete User
// @route   DELETE /user
// @access  PRIVATE
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if(!id){
    return res.status(400).json({ message: `User ID is required`})
  }
  const notes = await Notes.findOne({ user: id }).lean();

  if(notes?.length) {
    return res.status(400).json({ message: `User has assigned Notes` })
  }

  const user = await User.findById(id).exec()
  
  if(!user){
    return res.status(400).json({ message: `User Not Found` })
  }

  const result = await User.deleteOne()

  const reply = `User Name ${result.username} with ID ${result._id} is Deleted`

  res.json(reply)

});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
