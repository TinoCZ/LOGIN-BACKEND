import dotenv from "dotenv"
/* Esto carga las variables de entorno del archivo .env en process.env */
dotenv.config()

const ENVIRONMENT = {
    MONGO_DB_URI: process.env.MONGO_DB_URI,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    GMAIL_USERNAME: process.env.GMAIL_USERNAME,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    URL_FRONTEND: process.env.URL_FRONTEND,
    URL_BACKEND: process.env.URL_BACKEND
}

export default ENVIRONMENT