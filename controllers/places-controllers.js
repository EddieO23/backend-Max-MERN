const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');

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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid; // {pid: 'p1'}
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError('Could not find a place for the provided ID.', 404);
  }

  res.json({ place }); // => {place} => {place:place}
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!place) {
    return next(
      new HttpError('Could not find a place for the provided userID.', 404)
    );
  }

  res.json({ place });
};

const createPlace = (req, res, next) => {
  const {title, description, coordinates, address, creator } = req.body
  // This syntax of destructuring is shorthand for const title = req.body...etc
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator
  }

  DUMMY_PLACES.push(createdPlace)

  res.status(201).json({place: createdPlace})
};

const updatePlace = (req, res, next) => {
  const {title, description } = req.body
  const placeId = req.params.pid;

  const updatedPlace = {...DUMMY_PLACES.find(p => p.id === placeId)}
  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId)
  updatedPlace.title = title
  updatedPlace.description = description

  DUMMY_PLACES[placeIndex] = updatedPlace

  res.status(200).json({place: updatedPlace})
}

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId)
  res.status(200).json({msg: 'Succesfully deleted a place.'})
}

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace