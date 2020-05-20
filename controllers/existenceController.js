const Existence = require('../models/existenceModel');
const factory = require('./handlerFactory');
const existenceControllerUtils = require('./existenceControllerUtils');

exports.createExistence = existenceControllerUtils.createExistence();
exports.bringQ1Results = existenceControllerUtils.bringQ1Results();
exports.bringJobQueueResults = existenceControllerUtils.bringJobQueueResults();
