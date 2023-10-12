const enums = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNAUTHORIZED_ERROR: 'UNAUTHORIZED_ERROR'
}

const regexes = {
    EMAIL: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
    PASSWORD: /[^\w\d]*(([0-9]+.*[A-Z]+.*)|[A-Z]+.*([0-9]+.*))/
}

const messages = {
    VALIDATION_MESSAGE: 'User cannot be validated',
    UNAUTHORIZED_MESSAGE: 'User is not authorized',
    EMAIL_PASSWORD_REQUIRED: 'Both email and password are required',
    NOT_EMAIL: 'Wrong email format',
    PASSWORD_FORMAT: 'Password should have at least an uppercase letter, lowercase letter and a number.',
    REG_SUCCESS: 'User successfully created.',
    NO_UID: 'User id is required',
    NO_VERIFICATION_VALUE: 'Verification value should be boolean',
    VER_SUCCESS: 'User verification updated.',
    USERS_RETRIEVED: 'Users successfully retrieved',
    USER_DELETED: 'User successfully deleted',
}

module.exports = {
    enums,
    regexes,
    messages
} 