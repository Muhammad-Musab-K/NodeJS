class ApisError extends Error {
    constructor(
        statusCode,
        message = "something went wrong",
        errors = [],
        stack = ""

    ) {
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.data = null
        this.error = errors
        this.success = false

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApisError }

//The data property appears to be intended as a placeholder for additional data that you may want to attach to the error object when you create an instance of ApisError. This could be any kind of contextual or supplementary data related to the error situation that you think would be helpful for handling or diagnosing the error.