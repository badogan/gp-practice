const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Existence = require('../models/existenceModel');

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

    const result = await (async () => await Existence.aggregate(aggObj))();

    res.status(200).json({
      status: 'success',
      data: {
        length: result.length,
        data: result
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
