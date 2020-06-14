const catchAsyncError = (func) => {
    return (request, response, next) => {
        func(request, response, next).catch(next);
    }
}

module.exports = catchAsyncError;