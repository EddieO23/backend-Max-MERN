const express = require('express')
const bodyParse = require('body-parser')

const placesRouters = require('./routes/PlacesRoutes')

const app = express()

app.use('/api/places', placesRouters) // => /api/places...


app.listen(4000)