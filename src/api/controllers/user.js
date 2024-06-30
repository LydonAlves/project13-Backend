const bcrypt = require('bcryptjs')
const { generateKey } = require('../../utils/jwt')
const User = require('../models/user')

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    return res.status(200).json(user)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const getUserByClassGroup = async (req, res, next) => {
  const { classGroup } = req.params
  if (!classGroup) {
    return res.status(400).json({ error: 'Class group parameter is required' });
  }

  try {
    const user = await User.find({ classGroup: classGroup })
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found for this class group' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
    return res.status(200).json(users)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const register = async (req, res, next) => {
  try {
    const userDuplicated = await User.findOne({ userName: req.body.userName })

    if (userDuplicated) {
      console.log('User already exists, choose a different name.');
      return res
        .status(409)
        .json('User already exists, choose a different name.')
    }

    const newUser = new User({
      country: req.body.country,
      email: req.body.email,
      password: req.body.password,
      userName: req.body.userName,
    })

    const user = await newUser.save()

    return res.status(200).json(user)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json('User or password are incorrect')
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = generateKey(user._id)
      return res.status(200).json({ token, user })
    }

    return res.status(400).json('User or password are incorrect')
  } catch (error) {
    return res.status(400).json(error)
  }
}

const putUserInfo = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      console.log("User not found with ID:", id);
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in putUserInfo:', error);
    return res.status(400).json(error);
  }
}

const deleteUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: 'Error deleting user', error });
  }
};

module.exports = {
  getUserById,
  getUserByClassGroup,
  getAllUsers,
  register,
  login,
  putUserInfo,
  deleteUserById
}
