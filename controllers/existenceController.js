const Existence = require('../models/existenceModel');
const factory = require('./handlerFactory');
const existenceControllerUtils = require('./existenceControllerUtils');

exports.createExistence = factory.createOne(Existence);
exports.bringQ1Results = existenceControllerUtils.bringQ1Results();
exports.bringQ2Results = existenceControllerUtils.bringQ2Results();
