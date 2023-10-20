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
    NO_UID: 'User ID is required',
    NO_VERIFICATION_VALUE: 'Verification value should be boolean',
    VER_SUCCESS: 'User verification updated.',
    USERS_RETRIEVED: 'Users successfully retrieved',
    USER_DELETED: 'User successfully deleted',
    SUCCESS_LOGOUT: 'You signed out successfully',
    /** company messages */
    COMP_CREATED: 'New company created successfully',
    COMP_UPDATED: 'Company updated successfully',
    COMP_DELETED: 'Company deleted successfully',
    COMP_REQUIRED: 'Name and Email Address are required',
    COMP_UPDATE_REQUIRED: 'Company ID and details object are required',
    NONEXISTENT_COMP: 'Company does not exist',
    COMP_UPDATE_SUCCESS: 'Company was updated successfully',
    COMPS_FETCHED: 'Companies fetched successfully',
    COMP_FETCHED: 'Company information fetched successfully',
    NO_COMP_ID: 'Company ID is required',
    /** agency messages */
    AGEN_CREATED: 'New agency created successfully',
    AGEN_UPDATED: 'Agency updated successfully',
    AGEN_DELETED: 'Agency deleted successfully',
    AGEN_REQUIRED: 'Name, Introduction and Email Address are all required',
    AGEN_UPDATE_REQUIRED: 'Agency ID and details object are required',
    NONEXISTENT_AGEN: 'Agency does not exist',
    AGEN_UPDATE_SUCCESS: 'Agency was updated successfully',
    AGENS_FETCHED: 'Agencies fetched successfully',
    AGEN_FETCHED: 'Agency information fetched successfully',
    NO_AGEN_ID: 'Agency ID is required',
    /** campaign messages */
    CAMP_CREATED: 'New campaign created successfully',
    CAMP_UPDATED: 'Campaign updated successfully',
    CAMP_DELETED: 'Campaign deleted successfully',
    CAMP_REQUIRED: 'Name, Company ID, Category IDs, Agency ID and Email Address are all required',
    CAMP_CAT_ID_TYPE: 'Category IDs should be an array of ids',
    CAMP_UPDATE_REQUIRED: 'Campaign ID and details object are required',
    NONEXISTENT_CAMP: 'Campaign does not exist',
    CAMP_UPDATE_SUCCESS: 'Campaign was updated successfully',
    CAMPS_FETCHED: 'Campaigns fetched successfully',
    CAMP_FETCHED: 'Campaign information fetched successfully',
    NO_CAMP_ID: 'Campaign ID is required',
    /** category messages */
    CAT_CREATED: 'New category created successfully',
    CAT_UPDATED: 'Category updated successfully',
    CAT_DELETED: 'Category deleted successfully',
    CAT_REQUIRED: 'Name and Description are required',
    CAT_UPDATE_REQUIRED: 'Category ID and details object are required',
    NONEXISTENT_CAT: 'Category does not exist',
    CAT_UPDATE_SUCCESS: 'Category was updated successfully',
    CATS_FETCHED: 'Categories fetched successfully',
    CAT_FETCHED: 'Category information fetched successfully',
    NO_CAT_ID: 'Category ID is required',
    /** nomination messages */
    NOM_CREATED: 'New nomination created successfully',
    NOM_UPDATED: 'Nomination updated successfully',
    NOM_DELETED: 'Nomination deleted successfully',
    NOM_REQUIRED: 'Judge ID, Campaign ID, Idea, Insight, Community Integration, KPIs & Impact, Execution, and Comment are all required',
    NOM_RATING_FORMAT: 'Idea, Insight, Community Integration, KPIs & Impact, and Execution should be numbers',
    NOM_UPDATE_REQUIRED: 'Nomination ID and details object are required',
    NONEXISTENT_NOM: 'Nomination does not exist',
    NOM_UPDATE_SUCCESS: 'Nomination was updated successfully',
    NOMS_FETCHED: 'Nominations fetched successfully',
    NOM_FETCHED: 'Nomination information fetched successfully',
    NO_NOM_ID: 'Nomination ID is required',
}

module.exports = {
    enums,
    regexes,
    messages
} 