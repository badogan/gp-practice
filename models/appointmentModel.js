const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    appDate: {
      type: Date,
      default: Date.now(),
      // required: [true, 'Appointment date cannot be empty'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    otherParty: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

appointmentSchema.pre(/^find/, (next) => {
  //   this.populate({
  //     path: 'tour',
  //     select: '-__v'
  //   }).populate({
  //     path: 'user',
  //     select: 'name photo'
  //   });

  // this.populate({
  //   path: 'user',
  //   select: 'name',
  // });

  next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
