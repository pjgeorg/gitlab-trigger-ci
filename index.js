const core = require('@actions/core');
const querystring = require('querystring');
const https = require('https');

function sleep(ms) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

function trigger(host, port, ca, projectID, token, ref) {
  return new Promise((resolve, reject) => {
    const form = querystring.stringify({'ref' : ref, 'token' : token});

    const options = {
      protocol : 'https:',
      host : host,
      port : port,
      ca : ca,
      path : '/api/v4/projects/' + projectID + '/trigger/pipeline',
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length' : form.length
      },
      method : 'POST'
    };

    const req = https.request(options, (res) => {
      var body = [];

      res.on('data', (chunk) => { body.push(chunk); });

      res.on('end', () => {
        body = JSON.parse(Buffer.concat(body).toString());
        console.log('GitLab Pipeline URL: ' + body.web_url);
        resolve(body.id);
      });
    });

    req.on('error', (error) => { reject(error.message); });

    req.write(form);

    req.end();
  });
}

function poll(host, port, ca, projectID, id) {
  return new Promise((resolve, reject) => {
    const options = {
      protocol : 'https:',
      host : host,
      port : port,
      ca : ca,
      path : '/api/v4/projects/' + projectID + '/pipelines/' + id,
      method : 'GET'
    };

    const req = https.request(options, (res) => {
      var body = [];

      res.on('data', (chunk) => { body.push(chunk); });

      res.on('end', () => {
        try {
          body = JSON.parse(Buffer.concat(body).toString());
          resolve(body.status);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => { reject(error.message); });

    req.end();
  });
}

async function run() {
  try {
    const host = core.getInput('host');
    const port = core.getInput('port');
    const ca = core.getInput('ca-bundle');
    const projectID = core.getInput('project-id');
    const token = core.getInput('token');
    const ref = core.getInput('ref');
    const delay = core.getInput('delay');

    const id = await trigger(host, port, ca, projectID, token, ref);

    let status = 'pending';
    while (status == 'pending' || status == 'running') {
      await sleep(delay);
      status = await poll(host, port, ca, projectID, id);
    }

    if (status != 'success') {
      throw new Error("GitLab CI job failed.")
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()
