const Appointment = require('../models/appointmentModel');
const factory = require('./handlerFactory');

exports.getAllAppointments = factory.getAll(Appointment);
// exports.getBook = factory.getOne(Book, { path: 'user' });
exports.getAppointment = factory.getOne(Appointment);
exports.createAppointment = factory.createOne(Appointment);
exports.updateAppointment = factory.updateOne(Appointment);
exports.deleteAppointment = factory.deleteOne(Appointment);
