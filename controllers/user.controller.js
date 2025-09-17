const User = require('../models/User');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-password -__v');

  if (!users || users.length === 0) {
    return next(new AppError('No users found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Users fetched successfully',
    results: users.length,
    data: users,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { username } = req.params;

  if (!username) {
    return next(new AppError('Please provide a username', 400));
  }

  const user = await User.findOne({ username }).select('-password -__v');

  if (!user) {
    return next(new AppError('Could not find user!', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'User found successfully',
    data: user,
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  const safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.__v;

  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    data: safeUser,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { username } = req.params;

  if (!username) {
    return next(new AppError('Please provide a username', 400));
  }

  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'Please use the /updatePassword route to change password',
        403
      )
    );
  }

  const user = await User.findOneAndUpdate({ username }, req.body, {
    runValidators: true,
    new: true,
  }).select('-password -__v');

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'User updated successfully',
    data: user,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { username } = req.params;

  if (!username) {
    return next(new AppError('Please provide a username', 400));
  }

  const user = await User.findOneAndDelete({ username });

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  res.status(200).json({
    status: 'success',
    message: `User ${username} deleted successfully`,
  });
});
