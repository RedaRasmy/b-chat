export class HttpError extends Error {
    constructor(
        public statusCode: number,
        message: string,
    ) {
        super(message)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
    }
}

export class NotFoundError extends HttpError {
    constructor(message = "Resource not found") {
        super(404, message)
    }
}

export class ForbiddenError extends HttpError {
    constructor(message = "Access forbidden") {
        super(403, message)
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message = "Unauthorized") {
        super(401, message)
    }
}

export class BadRequestError extends HttpError {
    constructor(message = "Bad request") {
        super(400, message)
    }
}

export class ConflictError extends HttpError {
    constructor(message = "Conflict") {
        super(409, message)
    }
}
