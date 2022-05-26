const { AppError } = require("./../errors/AppError");

function errorHandler(err, req, res, next) {
    if (err instanceof AppError) {
        console.log('AppError:', err);
        return res.status(err.statusCode).json({
            message: err.message
        });
    }

    console.error('Fatal:', err);

    return res.status(500).json({
        message: 'Internal Server Error'
    });
}

module.exports = { 
    errorHandler 
};