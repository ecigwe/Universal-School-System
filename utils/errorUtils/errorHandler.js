function errorHandler(status, message) {
  const err = new Error();
  err.statusCode = status;
  err.status = 'error';
  err.message = message;
  err.isOperational = true;
  throw err;
}

module.exports = errorHandler;
