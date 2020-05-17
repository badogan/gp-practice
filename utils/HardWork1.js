/* eslint-disable arrow-parens */
/* eslint-disable no-use-before-define */
const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });
const moment = require('moment');
const Queue = require('bull');
const receiveQueue = new Queue('HardWork1');
const { MongoClient } = require('mongodb');

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
  const client = new MongoClient(DB);
  try {
    const resultPart1 = formAggregationObject(job.data.rawResult[0]);
    await client.connect();
    const result = await bringAggregationResult(client, resultPart1);
    console.log('THE RESULT:', result);
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }

  done();
});

async function bringAggregationResult(client, formedObj) {
  const aggregateCursor = await client
    .db('gp-practice')
    .collection('existences')
    .aggregate(formedObj);

  const result = [];
  await aggregateCursor.forEach(one => result.push(`${one.eMAC}`));
  return result;
}

const formAggregationObject = obj => {
  const [longitude, latitude] = obj.location.coordinates;
  const dateLowerBoundary = moment(new Date(obj.eTimestamp))
    .subtract(2, 'hours')
    ._d.toISOString();
  const dateUpperBoundary = moment(new Date(obj.eTimestamp))
    .add(2, 'hours')
    ._d.toISOString();

  const aggObj = [
    {
      $geoNear: {
        near: {
          type: obj.location.type,
          coordinates: [longitude, latitude]
        },
        distanceField: 'dist.calculated',
        maxDistance: 10, //TODO Hardcoded for now
        spherical: true,
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
  return aggObj;
};
