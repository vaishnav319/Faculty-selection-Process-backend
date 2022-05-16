"use strict";
const dotenv = require("dotenv");
const assert = require("assert");
dotenv.config();

const {
  PORT,
  MONGO_DB_PW,
  MONGO_IAM,
  MONGO_DB,
  JWT_ACCESS_KEY,
  CLOUD_NAME,
  CLOUD_API_SECRET,
  FAST_TO_SMS,
  CLOUD_API_KEY,
} = process.env;

assert(MONGO_DB_PW, "MongoDB Password is required");
assert(MONGO_IAM, "Mongodb User is required");
assert(MONGO_DB, "MongoDB String is required");
assert(PORT, "Server Port is required");
assert(CLOUD_NAME, " CLOUD_NAME is required");
assert(CLOUD_API_SECRET, " CLOUD_API_SECRET is required");
assert(CLOUD_API_KEY, " CLOUD_API_KEY is required");
assert(JWT_ACCESS_KEY, "JWT_ACCESS_KEY is required");
assert(FAST_TO_SMS, "FAST_TO_SMS is required");

module.exports = {
  port: PORT,
  mongoPw: MONGO_DB_PW,
  mongoIAM: MONGO_IAM,
  mongoDb: MONGO_DB,
  JWT_ACCESS_KEY: JWT_ACCESS_KEY,
  CLOUD_NAME: CLOUD_NAME,
  CLOUD_API_KEY: CLOUD_API_KEY,
  CLOUD_API_SECRET: CLOUD_API_SECRET,
  FAST_TO_SMS: FAST_TO_SMS,
};
