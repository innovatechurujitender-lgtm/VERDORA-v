const serverless = require('serverless-http');
const app = require('../../backend/server.cjs');

exports.handler = serverless(app, {
  request: function (request, event, context) {
    request.url = event.path;
  }
});
