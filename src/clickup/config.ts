import dotenv from "dotenv";

dotenv.config();

export const config = {
  clickupToken: process.env.CLICKUP_API_KEY!,
};