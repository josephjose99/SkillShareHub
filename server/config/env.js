const { cleanEnv, str, port, url, bool } = require('envalid');

function validateEnv() {
  cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
    PORT: port({ default: 5000 }),
    MONGODB_URI: url(),
    JWT_SECRET: str(),
    GOOGLE_CLIENT_ID: str(),
    GOOGLE_CLIENT_SECRET: str(),
    PAYPAL_CLIENT_ID: str(),
    PAYPAL_CLIENT_SECRET: str(),
    PAYPAL_MODE: str({ choices: ['sandbox', 'live'] }),
    CLOUDINARY_CLOUD_NAME: str(),
    CLOUDINARY_API_KEY: str(),
    CLOUDINARY_API_SECRET: str(),
    CLIENT_URL: url({ default: 'http://localhost:3000' })
  });
}

module.exports = validateEnv; 