/* eslint-disable arrow-parens */
/* eslint-disable no-use-before-define */
const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });
const moment = require('moment');
const Queue = require('bull');
const receiveQueue = new Queue('HardWork1');
const { MongoClient, ObjectID } = require('mongodb');
const JobQueue = require('../models/jobQueueModel');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const compose = (f, g) => (...args) => f(g(...args));
const taskRunner = (...fns) => fns.reduce(compose);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

receiveQueue.process(async (job, done) => {
  const maxDistance = job.data.maxDistance;
  const client = new MongoClient(DB);
  try {
    await client.connect();
    const resultsAll = await Promise.all(
      job.data.rawResult.map(doc => {
        doc.maxDistance = maxDistance;
        return taskRunner(bringAggregationResult, formAggregationObject)(
          doc,
          client
        );
      })
    );
    // console.log('ALL THE RESULT:', resultsAll);
    const searchResult = [...new Set(resultsAll.flat())];
    //ListInvolvedParties
    //
    await updateJobQueue({
      client,
      refId: job.data.refId,
      searchResult
    });
    console.log('Completed. JobQueue _id: ', job.data.refId);
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }

  done();
});

async function updateJobQueue({ client, refId, searchResult }) {
  await client
    .db('gp-practice')
    .collection('jobqueues')
    .updateOne(
      { _id: new ObjectID(refId) },
      { $set: { searchResult, completedAt: moment().toISOString() } }
    );
}

async function bringAggregationResult({ client, formedObj }) {
  const aggregateCursor = await client
    .db('gp-practice')
    .collection('existences')
    .aggregate(formedObj);

  const result = [];
  await aggregateCursor.forEach(one => result.push(`${one._id}`));
  return result;
}

const formAggregationObject = (obj, client) => {
  const [longitude, latitude] = obj.location.coordinates;
  const dateLowerBoundary = moment(new Date(obj.eTimestamp))
    .subtract(1, 'minutes')
    ._d.toISOString();
  const dateUpperBoundary = moment(new Date(obj.eTimestamp))
    .add(1, 'minutes')
    ._d.toISOString();

  const formedObj = [
    {
      $geoNear: {
        near: {
          type: obj.location.type,
          coordinates: [longitude, latitude]
        },
        distanceField: 'dist.calculated',
        // maxDistance: 40,
        maxDistance: obj.maxDistance,
        // spherical: true,
        key: 'location'
      }
    },
    {
      $match: {
        eTimestamp: {
          $lte: new Date(dateUpperBoundary),
          $gte: new Date(dateLowerBoundary)
        }
      }
    }
  ];
  return { client, formedObj };
};
