const fs = require('fs');
const path = require('path')

const express = require('express');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');

const placesRouters = require('./routes/PlacesRoutes');
const usersRouters = require('./routes/UsersRoutes');
const HttpError = require('./models/http-error');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')))

// The following middleware function is specifically for CORS functionality
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/api/places', placesRouters); // => /api/places...
app.use('/api/users', usersRouters);

app.use((req, res, next) => {
  const error = new HttpError('This route does not exist.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred.' });
});

mongoose
  .connect(
    'mongodb+srv://eocampo52:pd3Tihxj2FuXX9gJ@placesmern.kdjxxeq.mongodb.net/MERN?retryWrites=true&w=majority'
  )
  .then(() => {
    app.listen(4000);
    console.log('MongoDB Succesfully Connected.');
  })
  .catch((err) => console.log(err));
