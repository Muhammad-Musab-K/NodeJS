class ApiResponse {
    constructor(
        statusCode,
        data,
        message,

    ) {
        this.statusCode = statusCode
        this.message = message;
        this.data = data
        this.succes = statusCode
    }
}

export { ApiResponse }