class ApiError {
    constructor(
        statusCode,
        message = "something is wrong",
        errors = [],
        stack

    ) {
        this.statusCode = statusCode;
        this.message = message;
        this.error = errors;
        this.success = false;
        this.data = null;

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }