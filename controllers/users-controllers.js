const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error')

const DUMMY_PLACES = [
  {
    id: 'u1',
    name: 'Eddie O',
    email: 'test@test.com',
    password: 'test123'
  }
]

const getUsers = (req, res, next) => {
res.json({users: DUMMY_PLACES})
};

const signUp = (req, res, next) => {
  const {name, email, password} = req.body

  const hasUser = DUMMY_PLACES.find(u => u.email === email)
  if(hasUser) {
    throw new HttpError('Could not create user. Email is already taken.', 422)
  }


  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password
  }
  DUMMY_PLACES.push(createdUser)
  res.status(201).json({user: createdUser})
};

const login = (req, res, next) => {
  const {email, password} = req.body

  const identifiedUser = DUMMY_PLACES.find(u => u.email === email)
  
  if(!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError('Could not identified user. Credentials seem to be wrong.', 401)
  }

  res.json({message: 'Logged in!'})
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
