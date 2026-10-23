import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,
  byrypt_salt_rounds: process.env.BYCRYPT_SALT_ROUNDS,

  jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN as string,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN as string,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY!,
  client_url:
    process.env.CLIENT_URL ||
    process.env.FRONTEND_APP_URL ||
    "http://localhost:3000",
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,
  groq_api_key: process.env.GROQ_API_KEY,
  gemini_api_key: process.env.GIMINI_API_KEY || process.env.GEMINI_API_KEY,
};
