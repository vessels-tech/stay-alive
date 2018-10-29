// import { serviceAccountKeyFileName, databaseUrl, storageBucket } from "../utils/Env";
const functions = require('firebase-functions');
const request = require('request-promise');

const serviceAccount = require("./.serviceAccountKey.json");

const admin = require('firebase-admin');
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ethereal-accord-184722.firebaseio.com"
  });
}


const callUrl = (url, method, bodyStr) => {
  if (method === 'GET') {
    return callUrlGet(url);
  }

  if (method !== 'POST') {
    throw new Error(`Unsupported Method: ${method}`);
  }

  return callUrlPost(url, method, bodyStr)
}

const callUrlPost = (url, method, body) => {
  const options = {
    method: 'POST',
    uri: url,
    json: true,
    body,
  };

  return request(options)
    .then(response => {
      console.log(response);
      return true;
    })
    .catch(err => {
      console.error(err);
      return false;
    });
}

const callUrlGet = (url) => {
  const options = {
    method: 'GET',
    uri: url,
    json: true
  };

  return request(options)
  .then(response => {
    console.log(response);
		return true;
  })
  .catch(err => {
    console.error(err);
    return false;
  });
}

const everyMinuteHandler = (event) => {

  //Lookup in database for urls to be called
  // call it

  return admin.database().ref(`/urls`).once('value')
  .then(snapshot => snapshot.val())
  .then(values => {
    return Promise.all(
      Object.keys(values).map(key => {
        const obj = values[key];
        return callUrl(obj.url, obj.method, obj.body);
      })
    );
  });

};

exports.minute_job = functions.pubsub.topic('every-minute-tick').onPublish(everyMinuteHandler);

exports.test = everyMinuteHandler;