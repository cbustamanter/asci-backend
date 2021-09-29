export const __prod__ = process.env.NODE_ENV === "production";
export const COOKIE_NAME = "qid";
export const FORGOT_PASSWORD_PREFIX = "forgot-password:";
export const S3_BUCKET = process.env.COURSE_SESSION_BUCKETNAME;
export const S3_COVER_PATH = "/cover-photos";
export const S3_SESSION_PATH = "/sessions";
export const TO_EMAIL = process.env.TO_MAIL;
export const TO_NAME = process.env.TO_NAME;
export const SENDGRID_KEY = process.env.SENDGRID_API_KEY;
