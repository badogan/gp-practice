const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'You must provide type for location object']
    },
    coordinates: {
      type: Array,
      required: [true, 'You must provide coordinates for location object']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
