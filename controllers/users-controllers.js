const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user-model');

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed. Please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map((u) => u.toObject({ getters: true })) });
};

const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        'Invalid inputs passed. Please check the input data you were trying to submit.',
        422
      )
    );
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed. Please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already. Please login instead.',
      422
    );
    return next(error);
  }
  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Signing up failed. Please try again', 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Could not log in. Try again later...', 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Invalid credentials. Could not log you in.',
      401
    );
    return next(error);
  }

  res.json({
    message: 'Logged in!',
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
