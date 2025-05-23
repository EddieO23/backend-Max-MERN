const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: {type: String, required: true}, // this is the userAvatar not the placeIMG
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place'}]
});


module.exports = mongoose.model('User', userSchema)
