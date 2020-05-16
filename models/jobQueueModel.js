const mongoose = require('mongoose');

const jobQueueSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    data: {
      type: Object
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const JobQueue = mongoose.model('JobQueue', jobQueueSchema);

module.exports = JobQueue;