const sendResponse = require('./response');
const errorHandler = require('../errorUtils/errorHandler');

const attachToToken = (request, response, next) => {
    const token = request.token;
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.JWT_EXPIRY_TIME * 1000 * 60 * 60 * 24)
    }

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = request.secure || request.headers['x-forwarded-proto'] === 'https';
        response.cookie('jwt', token, cookieOptions);
        if (cookieOptions.secure) return sendResponse(token, response.statusCode, request, response);
        return errorHandler(401, 'You cannot be logged in when your network connection is not secure!');
    }

    if (process.env.NODE_ENV === 'development') {
        response.cookie('jwt', token, cookieOptions);
        return sendResponse(token, response.statusCode, request, response);
    }
}

module.exports = attachToToken;