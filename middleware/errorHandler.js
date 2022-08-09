const { logEvents } = require('./logger');

const errorHandler = (err, req, res, net) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    'errLog.log'
  );
  console.log(err.stack);
  const resStatus = res.statusCode ? res.statusCode : 500; // Server Error
  res.send(resStatus);
  res.json({
    message: err.message,
  });
};

module.exports = errorHandler;
