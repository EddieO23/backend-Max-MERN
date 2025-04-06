const axios = require('axios')
require('dotenv').config();

const HttpError = require('../models/http-error')
const apiKey = process.env.GOOGLE_API_KEY;

async function getCoordsForAddress(address) {
  const response  = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`)

  const data = response.data
  if(!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError('Could not find a specified location for the specified address', 422)
    throw error
  }
   const coordinates = data.results[0].geometry.location

   return coordinates
}

module.exports = getCoordsForAddress


//example of URL query string for translating address into coordinates

// https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY