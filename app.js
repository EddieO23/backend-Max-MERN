const express = require('express')
const bodyParse = require('body-parser')

const placesRouters = require('./routes/PlacesRoutes')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

app.use('/api/places', placesRouters) // => /api/places...

app.use((error, req, res,next) => {
  if(res.headerSent) {
    return next(error)
  }
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occurred.'}) 
})

app.listen(4000)