const mongoose = require('mongoose');

const existenceSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    eOID: {
      type: String
      //   unique: true,
    },
    eTimestamp: {
      type: Date,
      default: Date.now()
      // required: [true, 'Appointment date cannot be empty'],
    },
    eMAC: {
      type: String
      //   unique: true,
    },
    cartesianLocation: {
      type: Array
    },
    location: {
      coordinates: {
        type: Array,
        required: [true, 'You must provide coordinates for location object']
      },
      type: {
        type: String,
        required: [true, 'You must provide type for location object']
      }
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// existenceSchema.pre(/^find/, (next) => {
//   //   this.populate({
//   //     path: 'tour',
//   //     select: '-__v'
//   //   }).populate({
//   //     path: 'user',
//   //     select: 'name photo'
//   //   });

//   // this.populate({
//   //   path: 'user',
//   //   select: 'name',
//   // });

//   next();
// });

const Existence = mongoose.model('Existence', existenceSchema);

module.exports = Existence;
