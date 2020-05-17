const mongoose = require('mongoose');

const jobQueueSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date
    },
    searchRequest: {
      type: Object
    },
    searchResult: {
      type: Array
    },
    completedAt: {
      type: Date
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const JobQueue = mongoose.model('JobQueue', jobQueueSchema);

module.exports = JobQueue;
