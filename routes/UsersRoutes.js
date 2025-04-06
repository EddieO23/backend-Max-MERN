const express = require('express');

const usersController = require('../controllers/users-controllers');

const HttpError = require('../models/http-error');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post('/signup', usersController.signUp);

router.post('/login', usersController.login);

module.exports = router;
