/* eslint-disable arrow-parens */
const loadJsonFile = require('load-json-file');
const fetch = require('node-fetch');

const targetURL = 'http://localhost:5001/api/v1/existence/newexistence';

const postSimple = (url, obj) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(obj)
  });
};

(async () => {
  const fileContents = await loadJsonFile('data1.json');
  fileContents.map(record => {
    postSimple(targetURL, record)
      .then(res => res.json())
      .then(doc => console.log('completed processing: ', doc.data.eMAC));
  });
})();
