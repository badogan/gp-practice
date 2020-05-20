/* eslint-disable arrow-parens */

const fs = require('fs');
const es = require('event-stream');
const fetch = require('node-fetch');
const delay = require('delay');

const targetURL = 'http://localhost:5001/api/v1/existence/newexistence';

const postSimple = (url, obj) => {
  console.log('Started processing: ', obj.eMAC);
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(obj)
  });
};

async function dataLoad(processThis) {
  const delayedPromise = delay(20000, { value: 'Done' });
  const result = await postSimple(targetURL, processThis)
    .then(res => res.json())
    .then(doc => {
      console.log('Completed processing: ', doc.data.eMAC);
      return doc;
    })
    .then(doc => {
      delayedPromise.clear();
      return doc;
    });
  await delayedPromise;
  // await delay(100);
  return result;
}

let lineNr = 0;
const s = fs
  .createReadStream('location_logs_test.json')
  .pipe(es.split())
  .pipe(
    es
      .mapSync(line => {
        // pause the readstream
        s.pause();

        lineNr += 1;
        console.log(lineNr);
        const currentObj = JSON.parse(line);
        const processThisObj = {
          eOID: currentObj._id.$oid,
          eTimestamp: currentObj.eTimeStamp.$date,
          eMAC: currentObj.eMAC,
          location: currentObj.location
        };
        console.log('currentObj.eMAC: ', currentObj.eMAC);
        dataLoad(processThisObj).then(() => s.resume());
      })
      .on('error', err => {
        console.log('Error while reading file.', err);
      })
      .on('end', () => {
        console.log('Read entire file.');
      })
  );
