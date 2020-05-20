// const projector = require('ecef-projector');
const moment = require('moment');
const Queue = require('bull');

const sendQueue = new Queue('HardWork1');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Existence = require('../models/existenceModel');
const JobQueue = require('../models/jobQueueModel');

const convertor = require('../utils/convertorUtil');

const factory = require('./handlerFactory');

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

    sendQueue.add({
      rawResult,
      refId: newJobQueueDoc._id,
      maxDistance: req.body.maxDistance
    });

    res.status(200).json({
      status: 'success',
      data: {
        refId: newJobQueueDoc._id
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
      eOID: req.body.eOID,
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

exports.bringJobQueueResults = () =>
  catchAsync(async (req, res, next) => {
    const doc = await JobQueue.findById(req.body.jobQueueId);
    if (doc && !doc.completedAt) {
      res.status(201).json({
        status: 'success',
        data: { message: 'Reference JobQueue still in progress' }
      });
    } else {
      const iterateThis = doc.searchResult;
      let involvedListArray = [];
      while (iterateThis.length > 0) {
        const targetItem = iterateThis.pop();
        console.log('targetItem:', targetItem);
        const result = await getEMAC(targetItem);
        involvedListArray.push(result);
      }
      const uniqueList = [...new Set(involvedListArray)];
      res.status(201).json({
        status: 'success',
        data: { count: uniqueList.length, uniqueList }
      });
    }
  });

async function getEMAC(oneItem) {
  const result = await Existence.findById(oneItem);
  return result.eMAC;
}
