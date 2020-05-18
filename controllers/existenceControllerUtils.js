// const projector = require('ecef-projector');
const moment = require('moment');
const Queue = require('bull');

const sendQueue = new Queue('HardWork1');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Existence = require('../models/existenceModel');
const JobQueue = require('../models/jobQueueModel');

const convertor = require('../utils/convertorUtil');

exports.bringQ1Results = () =>
  catchAsync(async (req, res, next) => {
    if (!Object.keys(req.body)) {
      //TODO Could be better - just checking existence to start with
      return next(new AppError('Q1 query details not available', 400));
    }

    const newJobQueueDoc = await JobQueue.create({
      searchRequest: req.body,
      createdAt: moment().toISOString()
    });
    console.log('Started. JobQueue _id: ', newJobQueueDoc._id);
    const aggObj = [
      {
        $match: {
          eMAC: req.body.eMAC,
          eTimestamp: {
            $gte: new Date(req.body.eTimestamp)
          }
        }
      }
    ];

    const rawResult = await (async () => await Existence.aggregate(aggObj))();

    sendQueue.add({ rawResult, refId: newJobQueueDoc._id });

    res.status(200).json({
      status: 'success',
      data: {
        refId: newJobQueueDoc._id
      }
    });
  });
//TODO Remove bringQ2Results - not used anymore. Don't forget to remove route as well
exports.bringQ2Results = () =>
  catchAsync(async (req, res, next) => {
    if (!Object.keys(req.body)) {
      //TODO Could be better - just checking existence to start with
      return next(new AppError('Q1 query details not available', 400));
    }

    const aggObj = [
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [req.body.longitude, req.body.latitude]
          },
          distanceField: 'dist.calculated',
          maxDistance: req.body.maxDistance,
          key: 'location'
        }
      },
      {
        $match: {
          eTimestamp: {
            $lte: new Date(req.body.endDate),
            $gte: new Date(req.body.startDate)
          }
        }
      }
    ];

    const result = await (async () => await Existence.aggregate(aggObj))();

    res.status(200).json({
      status: 'success',
      data: {
        length: result.length,
        data: result
      }
    });
  });

exports.createExistence = () =>
  catchAsync(async (req, res, next) => {
    const result = convertor.cartesianToLongLatWithOffset({
      x: req.body.location.coordinates[0],
      y: req.body.location.coordinates[1],
      offsetLongitude: 0.0,
      offsetLatitude: 51.0
    });

    const existenceObj = {
      eTimestamp: req.body.eTimestamp,
      eMAC: req.body.eMAC,
      cartesianLocation: [
        req.body.location.coordinates[0],
        req.body.location.coordinates[1]
      ],
      location: {
        coordinates: [result.longitude, result.latitude],
        type: req.body.location.type
      }
    };

    const newDoc = await Existence.create(existenceObj);

    res.status(201).json({
      status: 'success',
      data: newDoc
    });
  });
