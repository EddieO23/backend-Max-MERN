const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place-model');
const User = require('../models/user-model');
const mongoose = require('mongoose');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Chicago',
    description: 'Chicago is the 3rd biggest city in the entire country!',
    imageUrl:
      'https://images.unsplash.com/photo-1565800847038-b509fad821f8?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    location: {
      lat: 41.87903616454928,
      lng: -87.63591490024716,
    },
    address: '233 S Wacker Dr, Chicago, IL 60606',
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Chi',
    description: 'Dont worry about me, pussy!',
    imageUrl:
      'https://images.unsplash.com/photo-1565800847038-b509fad821f8?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    address: '233 S Wacker Dr, Chicago, IL 60606',
    location: {
      lat: 41.87903616454928,
      lng: -87.63591490024716,
    },
    creator: 'u2',
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; // {pid: 'p1'}

  let place;
  try {
    place = await Place.findById(placeId).exec();
  } catch (err) {
    const error = new HttpError(
      'Somethin went wrong. Could not find a place.',
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      'Could not find a place for the provided ID.',
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) }); // => {place} => {place:place}
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed. Please try again.',
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided userID.', 404)
    );
  }

  res.json({ places: places.map((p) => p.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError(
        'Invalid inputs passed. Please check the input data you were trying to submit.',
        422
      )
    );
  }

  // This syntax of destructuring is shorthand for const title = req.body...etc
  const { title, description, address, creator } = req.body;

  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      'https://images.unsplash.com/photo-1565800847038-b509fad821f8?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    creator,
  });

  let user

  try {
    user = await User.findById(creator)
  } catch (err) {
    const error = new HttpError('Creating place failed. Please try again later...', 500)
    return next(error)
  }

  if(!user) {
    const error = new HttpError('Could not find user for provided ID.', 404)
    return next(error)
  }

  // MONGODB SESSION AND TRANSACTIONS
  try {
    const session = await mongoose.startSession()
    session.startTransaction()
    await createdPlace.save({session: session})

    user.places.push(createdPlace)
    await user.save({session:session})
    await session.commitTransaction()



  } catch (err) {
    const error = new HttpError('Creating place failed. Please try again', 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError(
        'Invalid inputs passed. Please check the input data you were trying to submit.',
        422
      )
    );
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong. Could not update place.',
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong. Could not update place.',
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findByIdAndDelete(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong. Could not delete place.',
      500
    );
    return next(error);
  }

  // The following code is from the actual course

  // let place
  // try {
  //    place = await Place.findById(placeId)
  // } catch (err) {
  //   const error = new HttpError('Something went wrong. Could not delete place.', 500)
  //   return next(error)
  // }

  // try {
  //   await place.remove()
  // } catch (err) {
  //   const error = new HttpError('Something went wrong. Could not delete place.', 500)
  //   return next(error)
  // }
  res.status(200).json({ msg: 'Succesfully deleted a place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
