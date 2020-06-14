const AppError = require('./appError');

const handleDuplicateFieldsError = (err) => {
    const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
    return new AppError(`${value} already in use. Please use something else.`, 500);
}

const handleCastError = () => {
    return new AppError(`We are unable to find what you are looking for!`, 500);
}

const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    return new AppError(`Invalid Input Data. ${errors.join('. ')}`, 500);
}

const handleJwtError = () => {
    return new AppError('An error occured. Please login again', 401);
}

const handleTokenExpiredError = () => {
    return new AppError('You have been logged out of the application, please login again.', 401);
}

const handleFileNotFoundError = () => {
    return new AppError('The file you intended to delete does not exist', 400);
}

const sendErrorInDevMode = (error, request, response) => {
    return response.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        err: error
    });
}

const sendErrorInProdMode = (err, request, response) => {
    if (err.isOperational) {
        return response.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    return response.status(500).json({ //Programming errors
        status: 'error',
        message: 'Something went very wrong.'
    });
}

const globalErrorHandler = (error, request, response, next) => {
    console.log(error);
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return sendErrorInDevMode(error, request, response); //Send Detailed Error To Developer
    } else if (process.env.NODE_ENV === 'production') {
        let err = { ...error };
        err.message = error.message;

        if (err.code === 11000) err = handleDuplicateFieldsError(err);
        if (err.name === 'CastError') err = handleCastError();
        if (err.name === 'ValidationError') err = handleValidationError(err);
        if (err.name === 'JsonWebTokenError') err = handleJwtError();
        if (err.name === 'TokenExpiredError') err = handleTokenExpiredError();
        if (err.code === 'ENOENT') err = handleFileNotFoundError();
        return sendErrorInProdMode(err, request, response); //Send Well Crafted Error To Our Clients
    }
}

module.exports = globalErrorHandler;