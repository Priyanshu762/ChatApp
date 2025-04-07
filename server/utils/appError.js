class AppError extends Error {
    constructor(message, statusCode,error) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
        // console.log("AppError",this);
        
    }
}

export default AppError;
