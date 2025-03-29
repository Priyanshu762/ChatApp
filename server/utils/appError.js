class AppError extends Error {
    constructor(message, statusCode,error,res) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
        // console.log("AppError",this);
        console.log("error",error);
        res.status(statusCode).json({
            status: this.status,
            message: this.message
        });
    }
}

export default AppError;
