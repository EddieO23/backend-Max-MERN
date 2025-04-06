const express = require('express');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');

const placesRouters = require('./routes/PlacesRoutes');
const usersRouters = require('./routes/UsersRoutes');
const HttpError = require('./models/http-error');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRouters); // => /api/places...
app.use('/api/users', usersRouters);

app.use((req, res, next) => {
  const error = new HttpError('This route does not exist.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred.' });
});

mongoose
  .connect(
    'mongodb+srv://eocampo52:pd3Tihxj2FuXX9gJ@placesmern.kdjxxeq.mongodb.net/places?retryWrites=true&w=majority'
  )
  .then(() => {
    app.listen(4000);
    console.log('MongoDB Succesfully Connected.');
  })
  .catch((err) => console.log(err));
