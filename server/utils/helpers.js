class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

const sendResponse = (res, statusCode, data) => {
    res.status(statusCode).json(data);
};

const sendError = (res, statusCode, message) => {
    res.status(statusCode).json({ error: message });
};

module.exports = {
    AppError,
    catchAsync,
    sendResponse,
    sendError
};
