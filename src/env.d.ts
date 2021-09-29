declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
    SESSION_SECRET: string;
    CORS_ORIGIN: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_DEFAULT_REGION: string;
    COURSE_SESSION_BUCKETNAME: string;
    SENDGRID_API_KEY: string;
    TO_MAIL: string;
    TO_NAME: string;
  }
}