const Queue = require('bull');

const sendQueue = new Queue('HardWork1');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Existence = require('../models/existenceModel');
const JobQueue = require('../models/jobQueueModel');

exports.bringQ1Results = () =>
  catchAsync(async (req, res, next) => {
    if (!Object.keys(req.body)) {
      //TODO Could be better - just checking existence to start with
      return next(new AppError('Q1 query details not available', 400));
    }

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

    sendQueue.add({ targetIds: rawResult.map(obj => obj._id) });

    res.status(200).json({
      status: 'success',
      data: {
        refId: "Temp success data"
      }
    });
  });

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
