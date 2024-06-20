const STATUS = {
    200: 'Ok',
    201: 'Created',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    417: 'Expectation Failed',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error',
    403: 'Forbidden',
    404: 'Not Found',
    202: 'Accepted'
};

const STATUS_CODES = {
    OK: 200,
    UNAUTHORIZED: 401,
    EXPACTATION_FAILURE: 417,
    INVALID_ENTITY: 422,
    INTERNAL_ERROR: 500,
    BAD_REQUEST: 400,
    PRECONDITION_FAILED: 412,
    NO_CONTENT: 204,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    ACCEPTED: 202,
    CONFLICT: 409
};

module.exports = {
    STATUS_CODES,
    STATUS,
}