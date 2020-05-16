const Queue = require('bull');
const moment = require('moment');

const receiveQueue = new Queue('HardWork1');

const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Existence = require('../models/existenceModel');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: '../config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('HardWork1 - DB connection successful!'));

const executeForOne = async id => {
  try {
    const targetDoc = await Existence.findById(id);
    // console.log('targetDoc: ', targetDoc);
    const dateLowerBoundary = moment(new Date(targetDoc.eTimestamp))
      .subtract(2, 'hours')
      ._d.toISOString();
    const dateUpperBoundary = moment(new Date(targetDoc.eTimestamp))
      .add(2, 'hours')
      ._d.toISOString();
    const aggObj = [
      {
        $near: {
          near: [targetDoc.location.longitude, targetDoc.location.latitude],
          distanceField: 'dist.calculated',
          maxDistance: 10, //TODO
          key: 'location'
        }
      },
      {
        $match: {
          eTimestamp: {
            $lte: dateUpperBoundary,
            $gte: dateLowerBoundary
          }
        }
      }
    ];
    // const result = await (async () => await Existence.aggregate(aggObj))();
    const result = await Existence.aggregate(aggObj);
    //   return Existence.aggregate(aggObj);
    return result;
  } catch (err) {
    console.log('ExecuteOne Related Error:', err);
  }
};

receiveQueue.process((job, done) => {
  console.log('Received message', job.data.targetIds);

  Promise.all(job.data.targetIds.map(id => executeForOne(id))).then(res =>
    console.log(res)
  );

  //   console.log('result: ', result);

  done();
});
