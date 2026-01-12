export const COOKIE_NAME = "app_session_id";
export const SESSION_EXPIRATION_MS = 1000 * 60 * 60 * 24; // 24 hours instead of 1 year
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = 'Please login (10001)';
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)';
export const SPAM_DETECTED_ERR_MSG = 'Spam detected (10003)';
