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
    /** company messages */
    COMP_CREATED: 'New company created successfully',
    COMP_UPDATED: 'Company updated successfully',
    COMP_DELETED: 'Company deleted successfully',
    COMP_REQUIRED: 'Name and Email Address are required',
    COMP_UPDATE_REQUIRED: 'Company id and details object are required',
    NONEXISTENT_COMP: 'Company does not exist',
    COMP_UPDATE_SUCCESS: 'Company was updated successfully',
    COMPS_FETCHED: 'Companies fetched successfully',
    COMP_FETCHED: 'Company information fetched successfully',
    NO_COMP_ID: 'Company id is required',
    /** agency messages */
    AGEN_CREATED: 'New agency created successfully',
    AGEN_UPDATED: 'Agency updated successfully',
    AGEN_DELETED: 'Agency deleted successfully',
    AGEN_REQUIRED: 'Name and Email Address are required',
    AGEN_UPDATE_REQUIRED: 'Agency id and details object are required',
    NONEXISTENT_AGEN: 'Agency does not exist',
    AGEN_UPDATE_SUCCESS: 'Agency was updated successfully',
    AGENS_FETCHED: 'Agencies fetched successfully',
    AGEN_FETCHED: 'Agency information fetched successfully',
    NO_AGEN_ID: 'Agency id is required',
}

module.exports = {
    enums,
    regexes,
    messages
} 