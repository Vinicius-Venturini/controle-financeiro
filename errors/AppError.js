class AppError{
    constructor(message = 'Bad Request', statusCode = 400){
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = {
    AppError
}