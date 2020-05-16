var Queue = require('bull');

var sendQueue = new Queue('Server B');
var receiveQueue = new Queue('Server A');

receiveQueue.process(function(job, done) {
  console.log('Received message', job.data.msg);
  done();
});

for (let i = 0; i < 20000; i++) {
  sendQueue.add({ msg: `Hello ${i}` });
}
