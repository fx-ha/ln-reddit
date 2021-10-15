declare namespace NodeJS {
  interface ProcessEnv {
    DB_URL: string
    DB_LOGGING: string
    DB_SYNC: string
    REDIS_URL: string
    PORT: string
    SESSION_SECRET: string
    CORS_ORIGIN: string
  }
}
