// src/app.ts
import cookieParser from "cookie-parser";
import express from "express";

// src/config.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
var config_default = {
  port: process.env.PORT || 5e3,
  database_url: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,
  byrypt_salt_rounds: process.env.BYCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  client_url: process.env.CLIENT_URL || process.env.FRONTEND_APP_URL || "http://localhost:3000",
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  groq_api_key: process.env.GROQ_API_KEY,
  gemini_api_key: process.env.GIMINI_API_KEY || process.env.GEMINI_API_KEY
};

// src/app.ts
import cors from "cors";

// src/models/auth/auth.route.ts
import { Router } from "express";

// src/models/auth/auth.controller.ts
import httpStatus from "http-status";

// src/utils/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/models/auth/auth.service.ts
import bcrypt from "bcryptjs";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path2 from "node:path";
import { fileURLToPath } from "node:url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.8.0",
  "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Booking {\n  id         String        @id @default(ulid())\n  userId     String\n  user       User          @relation(fields: [userId], references: [id])\n  propertyId String\n  property   Property      @relation(fields: [propertyId], references: [id])\n  status     BookingStatus @default(PENDING)\n  createdAt  DateTime      @default(now())\n  payment    Payment?\n}\n\nmodel Category {\n  id         String     @id @default(uuid())\n  name       String     @unique\n  properties Property[]\n}\n\nenum UserStatus {\n  ACTIVE\n  BANNED\n}\n\nenum Role {\n  TENANT\n  LANDLORD\n  ADMIN\n}\n\nenum BookingStatus {\n  PENDING\n  APPROVED\n  REJECTED\n  ACTIVE\n  PAID\n}\n\nenum PaymentStatus {\n  PENDING\n  SUCCESS\n  FAILED\n}\n\nenum PaymentProvider {\n  STRIPE\n}\n\nmodel Payment {\n  id            String          @id @default(uuid())\n  bookingId     String          @unique\n  booking       Booking         @relation(fields: [bookingId], references: [id])\n  userId        String\n  amount        Float\n  user          User            @relation(fields: [userId], references: [id])\n  provider      PaymentProvider @default(STRIPE)\n  status        PaymentStatus   @default(PENDING)\n  transactionId String\n  createdAt     DateTime        @default(now())\n}\n\nmodel Property {\n  id          String    @id @default(uuid())\n  title       String\n  location    String\n  price       Float\n  description String\n  image       String?\n  categoryId  String\n  category    Category  @relation(fields: [categoryId], references: [id])\n  landlordId  String\n  landlord    User      @relation(fields: [landlordId], references: [id])\n  bookings    Booking[]\n  reviews     Review[]\n  createdAt   DateTime  @default(now())\n}\n\nmodel Review {\n  id         String   @id @default(uuid())\n  rating     Int\n  comment    String\n  userId     String\n  user       User     @relation(fields: [userId], references: [id])\n  propertyId String\n  property   Property @relation(fields: [propertyId], references: [id])\n  createdAt  DateTime @default(now())\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id         String     @id @default(uuid())\n  name       String\n  email      String     @unique\n  password   String\n  role       Role       @default(TENANT)\n  status     UserStatus @default(ACTIVE)\n  createdAt  DateTime   @default(now())\n  properties Property[]\n  bookings   Booking[]\n  reviews    Review[]\n  payments   Payment[]\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"BookingToUser"},{"name":"propertyId","kind":"scalar","type":"String"},{"name":"property","kind":"object","type":"Property","relationName":"BookingToProperty"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"payment","kind":"object","type":"Payment","relationName":"BookingToPayment"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"properties","kind":"object","type":"Property","relationName":"CategoryToProperty"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToPayment"},{"name":"userId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"provider","kind":"enum","type":"PaymentProvider"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Property":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToProperty"},{"name":"landlordId","kind":"scalar","type":"String"},{"name":"landlord","kind":"object","type":"User","relationName":"PropertyToUser"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToProperty"},{"name":"reviews","kind":"object","type":"Review","relationName":"PropertyToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"propertyId","kind":"scalar","type":"String"},{"name":"property","kind":"object","type":"Property","relationName":"PropertyToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"properties","kind":"object","type":"Property","relationName":"PropertyToUser"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","properties","_count","category","landlord","bookings","user","property","reviews","booking","payments","payment","Booking.findUnique","Booking.findUniqueOrThrow","Booking.findFirst","Booking.findFirstOrThrow","Booking.findMany","data","Booking.createOne","Booking.createMany","Booking.createManyAndReturn","Booking.updateOne","Booking.updateMany","Booking.updateManyAndReturn","create","update","Booking.upsertOne","Booking.deleteOne","Booking.deleteMany","having","_min","_max","Booking.groupBy","Booking.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","_avg","_sum","Payment.groupBy","Payment.aggregate","Property.findUnique","Property.findUniqueOrThrow","Property.findFirst","Property.findFirstOrThrow","Property.findMany","Property.createOne","Property.createMany","Property.createManyAndReturn","Property.updateOne","Property.updateMany","Property.updateManyAndReturn","Property.upsertOne","Property.deleteOne","Property.deleteMany","Property.groupBy","Property.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","name","email","password","Role","role","UserStatus","status","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","rating","comment","userId","propertyId","title","location","price","description","image","categoryId","landlordId","bookingId","amount","PaymentProvider","provider","PaymentStatus","transactionId","BookingStatus","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "rgM6YAsIAADaAQAgCQAA3QEAIA0AAOABACB2AADeAQAwdwAACQAQeAAA3gEAMHkBAAAAAYABAADfAaIBIoEBQAC4AQAhkgEBALUBACGTAQEAtQEAIQEAAAABACAQBQAA4wEAIAYAANoBACAHAAC6AQAgCgAAuwEAIHYAAOEBADB3AAADABB4AADhAQAweQEAtQEAIYEBQAC4AQAhlAEBALUBACGVAQEAtQEAIZYBCADWAQAhlwEBALUBACGYAQEA4gEAIZkBAQC1AQAhmgEBALUBACEFBQAA_wIAIAYAAPwCACAHAADVAgAgCgAA1gIAIJgBAADdAgAgEAUAAOMBACAGAADaAQAgBwAAugEAIAoAALsBACB2AADhAQAwdwAAAwAQeAAA4QEAMHkBAAAAAYEBQAC4AQAhlAEBALUBACGVAQEAtQEAIZYBCADWAQAhlwEBALUBACGYAQEA4gEAIZkBAQC1AQAhmgEBALUBACEDAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAEAAAADACALCAAA2gEAIAkAAN0BACANAADgAQAgdgAA3gEAMHcAAAkAEHgAAN4BADB5AQC1AQAhgAEAAN8BogEigQFAALgBACGSAQEAtQEAIZMBAQC1AQAhAwgAAPwCACAJAAD9AgAgDQAA_gIAIAMAAAAJACABAAAKADACAAABACALCAAA2gEAIAkAAN0BACB2AADbAQAwdwAADAAQeAAA2wEAMHkBALUBACGBAUAAuAEAIZABAgDcAQAhkQEBALUBACGSAQEAtQEAIZMBAQC1AQAhAggAAPwCACAJAAD9AgAgCwgAANoBACAJAADdAQAgdgAA2wEAMHcAAAwAEHgAANsBADB5AQAAAAGBAUAAuAEAIZABAgDcAQAhkQEBALUBACGSAQEAtQEAIZMBAQC1AQAhAwAAAAwAIAEAAA0AMAIAAA4AIAEAAAAJACABAAAADAAgAwAAAAkAIAEAAAoAMAIAAAEAIAMAAAAMACABAAANADACAAAOACANCAAA2gEAIAsAANkBACB2AADVAQAwdwAAFAAQeAAA1QEAMHkBALUBACGAAQAA2AGgASKBAUAAuAEAIZIBAQC1AQAhmwEBALUBACGcAQgA1gEAIZ4BAADXAZ4BIqABAQC1AQAhAggAAPwCACALAAD7AgAgDQgAANoBACALAADZAQAgdgAA1QEAMHcAABQAEHgAANUBADB5AQAAAAGAAQAA2AGgASKBAUAAuAEAIZIBAQC1AQAhmwEBAAAAAZwBCADWAQAhngEAANcBngEioAEBALUBACEDAAAAFAAgAQAAFQAwAgAAFgAgAQAAAAMAIAEAAAAJACABAAAADAAgAQAAABQAIAEAAAAUACABAAAAAQAgAwAAAAkAIAEAAAoAMAIAAAEAIAMAAAAJACABAAAKADACAAABACADAAAACQAgAQAACgAwAgAAAQAgCAgAAMsCACAJAAClAgAgDQAApgIAIHkBAAAAAYABAAAAogECgQFAAAAAAZIBAQAAAAGTAQEAAAABARMAACEAIAV5AQAAAAGAAQAAAKIBAoEBQAAAAAGSAQEAAAABkwEBAAAAAQETAAAjADABEwAAIwAwCAgAAMkCACAJAACbAgAgDQAAnAIAIHkBAOcBACGAAQAAmQKiASKBAUAA6gEAIZIBAQDnAQAhkwEBAOcBACECAAAAAQAgEwAAJgAgBXkBAOcBACGAAQAAmQKiASKBAUAA6gEAIZIBAQDnAQAhkwEBAOcBACECAAAACQAgEwAAKAAgAgAAAAkAIBMAACgAIAMAAAABACAaAAAhACAbAAAmACABAAAAAQAgAQAAAAkAIAMEAAD4AgAgIAAA-gIAICEAAPkCACAIdgAA0QEAMHcAAC8AEHgAANEBADB5AQCnAQAhgAEAANIBogEigQFAAKoBACGSAQEApwEAIZMBAQCnAQAhAwAAAAkAIAEAAC4AMB8AAC8AIAMAAAAJACABAAAKADACAAABACAGAwAAuQEAIHYAANABADB3AAA1ABB4AADQAQAweQEAAAABegEAAAABAQAAADIAIAEAAAAyACAGAwAAuQEAIHYAANABADB3AAA1ABB4AADQAQAweQEAtQEAIXoBALUBACEBAwAA1AIAIAMAAAA1ACABAAA2ADACAAAyACADAAAANQAgAQAANgAwAgAAMgAgAwAAADUAIAEAADYAMAIAADIAIAMDAAD3AgAgeQEAAAABegEAAAABARMAADoAIAJ5AQAAAAF6AQAAAAEBEwAAPAAwARMAADwAMAMDAADtAgAgeQEA5wEAIXoBAOcBACECAAAAMgAgEwAAPwAgAnkBAOcBACF6AQDnAQAhAgAAADUAIBMAAEEAIAIAAAA1ACATAABBACADAAAAMgAgGgAAOgAgGwAAPwAgAQAAADIAIAEAAAA1ACADBAAA6gIAICAAAOwCACAhAADrAgAgBXYAAM8BADB3AABIABB4AADPAQAweQEApwEAIXoBAKcBACEDAAAANQAgAQAARwAwHwAASAAgAwAAADUAIAEAADYAMAIAADIAIAEAAAAWACABAAAAFgAgAwAAABQAIAEAABUAMAIAABYAIAMAAAAUACABAAAVADACAAAWACADAAAAFAAgAQAAFQAwAgAAFgAgCggAAKMCACALAAD_AQAgeQEAAAABgAEAAACgAQKBAUAAAAABkgEBAAAAAZsBAQAAAAGcAQgAAAABngEAAACeAQKgAQEAAAABARMAAFAAIAh5AQAAAAGAAQAAAKABAoEBQAAAAAGSAQEAAAABmwEBAAAAAZwBCAAAAAGeAQAAAJ4BAqABAQAAAAEBEwAAUgAwARMAAFIAMAoIAACiAgAgCwAA_QEAIHkBAOcBACGAAQAA-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-CIkBAACwAX4iBIIBAAAAfgKDAQAAAH4IhAEAAAB-CIkBAACxAX4iDgQAAKwBACAgAACzAQAgIQAAswEAIIIBAQAAAAGDAQEAAAAEhAEBAAAABIUBAQAAAAGGAQEAAAABhwEBAAAAAYgBAQAAAAGJAQEAsgEAIYoBAQAAAAGLAQEAAAABjAEBAAAAAQuCAQEAAAABgwEBAAAABIQBAQAAAASFAQEAAAABhgEBAAAAAYcBAQAAAAGIAQEAAAABiQEBALMBACGKAQEAAAABiwEBAAAAAYwBAQAAAAEOAwAAuQEAIAcAALoBACAKAAC7AQAgDAAAvAEAIHYAALQBADB3AACQAQAQeAAAtAEAMHkBALUBACF6AQC1AQAhewEAtQEAIXwBALUBACF-AAC2AX4igAEAALcBgAEigQFAALgBACELggEBAAAAAYMBAQAAAASEAQEAAAAEhQEBAAAAAYYBAQAAAAGHAQEAAAABiAEBAAAAAYkBAQCzAQAhigEBAAAAAYsBAQAAAAGMAQEAAAABBIIBAAAAfgKDAQAAAH4IhAEAAAB-CIkBAACxAX4iBIIBAAAAgAECgwEAAACAAQiEAQAAAIABCIkBAACvAYABIgiCAUAAAAABgwFAAAAABIQBQAAAAASFAUAAAAABhgFAAAAAAYcBQAAAAAGIAUAAAAABiQFAAK0BACEDjQEAAAMAII4BAAADACCPAQAAAwAgA40BAAAJACCOAQAACQAgjwEAAAkAIAONAQAADAAgjgEAAAwAII8BAAAMACADjQEAABQAII4BAAAUACCPAQAAFAAgCXYAAL0BADB3AACKAQAQeAAAvQEAMHkBAKcBACGBAUAAqgEAIZABAgC-AQAhkQEBAKcBACGSAQEApwEAIZMBAQCnAQAhDQQAAKwBACAgAACsAQAgIQAArAEAIEIAAMABACBDAACsAQAgggECAAAAAYMBAgAAAASEAQIAAAAEhQECAAAAAYYBAgAAAAGHAQIAAAABiAECAAAAAYkBAgC_AQAhDQQAAKwBACAgAACsAQAgIQAArAEAIEIAAMABACBDAACsAQAgggECAAAAAYMBAgAAAASEAQIAAAAEhQECAAAAAYYBAgAAAAGHAQIAAAABiAECAAAAAYkBAgC_AQAhCIIBCAAAAAGDAQgAAAAEhAEIAAAABIUBCAAAAAGGAQgAAAABhwEIAAAAAYgBCAAAAAGJAQgAwAEAIQx2AADBAQAwdwAAdAAQeAAAwQEAMHkBAKcBACGBAUAAqgEAIZQBAQCnAQAhlQEBAKcBACGWAQgAwgEAIZcBAQCnAQAhmAEBAMMBACGZAQEApwEAIZoBAQCnAQAhDQQAAKwBACAgAADAAQAgIQAAwAEAIEIAAMABACBDAADAAQAgggEIAAAAAYMBCAAAAASEAQgAAAAEhQEIAAAAAYYBCAAAAAGHAQgAAAABiAEIAAAAAYkBCADHAQAhDgQAAMUBACAgAADGAQAgIQAAxgEAIIIBAQAAAAGDAQEAAAAFhAEBAAAABYUBAQAAAAGGAQEAAAABhwEBAAAAAYgBAQAAAAGJAQEAxAEAIYoBAQAAAAGLAQEAAAABjAEBAAAAAQ4EAADFAQAgIAAAxgEAICEAAMYBACCCAQEAAAABgwEBAAAABYQBAQAAAAWFAQEAAAABhgEBAAAAAYcBAQAAAAGIAQEAAAABiQEBAMQBACGKAQEAAAABiwEBAAAAAYwBAQAAAAEIggECAAAAAYMBAgAAAAWEAQIAAAAFhQECAAAAAYYBAgAAAAGHAQIAAAABiAECAAAAAYkBAgDFAQAhC4IBAQAAAAGDAQEAAAAFhAEBAAAABYUBAQAAAAGGAQEAAAABhwEBAAAAAYgBAQAAAAGJAQEAxgEAIYoBAQAAAAGLAQEAAAABjAEBAAAAAQ0EAACsAQAgIAAAwAEAICEAAMABACBCAADAAQAgQwAAwAEAIIIBCAAAAAGDAQgAAAAEhAEIAAAABIUBCAAAAAGGAQgAAAABhwEIAAAAAYgBCAAAAAGJAQgAxwEAIQt2AADIAQAwdwAAXgAQeAAAyAEAMHkBAKcBACGAAQAAygGgASKBAUAAqgEAIZIBAQCnAQAhmwEBAKcBACGcAQgAwgEAIZ4BAADJAZ4BIqABAQCnAQAhBwQAAKwBACAgAADOAQAgIQAAzgEAIIIBAAAAngECgwEAAACeAQiEAQAAAJ4BCIkBAADNAZ4BIgcEAACsAQAgIAAAzAEAICEAAMwBACCCAQAAAKABAoMBAAAAoAEIhAEAAACgAQiJAQAAywGgASIHBAAArAEAICAAAMwBACAhAADMAQAgggEAAACgAQKDAQAAAKABCIQBAAAAoAEIiQEAAMsBoAEiBIIBAAAAoAECgwEAAACgAQiEAQAAAKABCIkBAADMAaABIgcEAACsAQAgIAAAzgEAICEAAM4BACCCAQAAAJ4BAoMBAAAAngEIhAEAAACeAQiJAQAAzQGeASIEggEAAACeAQKDAQAAAJ4BCIQBAAAAngEIiQEAAM4BngEiBXYAAM8BADB3AABIABB4AADPAQAweQEApwEAIXoBAKcBACEGAwAAuQEAIHYAANABADB3AAA1ABB4AADQAQAweQEAtQEAIXoBALUBACEIdgAA0QEAMHcAAC8AEHgAANEBADB5AQCnAQAhgAEAANIBogEigQFAAKoBACGSAQEApwEAIZMBAQCnAQAhBwQAAKwBACAgAADUAQAgIQAA1AEAIIIBAAAAogECgwEAAACiAQiEAQAAAKIBCIkBAADTAaIBIgcEAACsAQAgIAAA1AEAICEAANQBACCCAQAAAKIBAoMBAAAAogEIhAEAAACiAQiJAQAA0wGiASIEggEAAACiAQKDAQAAAKIBCIQBAAAAogEIiQEAANQBogEiDQgAANoBACALAADZAQAgdgAA1QEAMHcAABQAEHgAANUBADB5AQC1AQAhgAEAANgBoAEigQFAALgBACGSAQEAtQEAIZsBAQC1AQAhnAEIANYBACGeAQAA1wGeASKgAQEAtQEAIQiCAQgAAAABgwEIAAAABIQBCAAAAASFAQgAAAABhgEIAAAAAYcBCAAAAAGIAQgAAAABiQEIAMABACEEggEAAACeAQKDAQAAAJ4BCIQBAAAAngEIiQEAAM4BngEiBIIBAAAAoAECgwEAAACgAQiEAQAAAKABCIkBAADMAaABIg0IAADaAQAgCQAA3QEAIA0AAOABACB2AADeAQAwdwAACQAQeAAA3gEAMHkBALUBACGAAQAA3wGiASKBAUAAuAEAIZIBAQC1AQAhkwEBALUBACGiAQAACQAgowEAAAkAIBADAAC5AQAgBwAAugEAIAoAALsBACAMAAC8AQAgdgAAtAEAMHcAAJABABB4AAC0AQAweQEAtQEAIXoBALUBACF7AQC1AQAhfAEAtQEAIX4AALYBfiKAAQAAtwGAASKBAUAAuAEAIaIBAACQAQAgowEAAJABACALCAAA2gEAIAkAAN0BACB2AADbAQAwdwAADAAQeAAA2wEAMHkBALUBACGBAUAAuAEAIZABAgDcAQAhkQEBALUBACGSAQEAtQEAIZMBAQC1AQAhCIIBAgAAAAGDAQIAAAAEhAECAAAABIUBAgAAAAGGAQIAAAABhwECAAAAAYgBAgAAAAGJAQIArAEAIRIFAADjAQAgBgAA2gEAIAcAALoBACAKAAC7AQAgdgAA4QEAMHcAAAMAEHgAAOEBADB5AQC1AQAhgQFAALgBACGUAQEAtQEAIZUBAQC1AQAhlgEIANYBACGXAQEAtQEAIZgBAQDiAQAhmQEBALUBACGaAQEAtQEAIaIBAAADACCjAQAAAwAgCwgAANoBACAJAADdAQAgDQAA4AEAIHYAAN4BADB3AAAJABB4AADeAQAweQEAtQEAIYABAADfAaIBIoEBQAC4AQAhkgEBALUBACGTAQEAtQEAIQSCAQAAAKIBAoMBAAAAogEIhAEAAACiAQiJAQAA1AGiASIPCAAA2gEAIAsAANkBACB2AADVAQAwdwAAFAAQeAAA1QEAMHkBALUBACGAAQAA2AGgASKBAUAAuAEAIZIBAQC1AQAhmwEBALUBACGcAQgA1gEAIZ4BAADXAZ4BIqABAQC1AQAhogEAABQAIKMBAAAUACAQBQAA4wEAIAYAANoBACAHAAC6AQAgCgAAuwEAIHYAAOEBADB3AAADABB4AADhAQAweQEAtQEAIYEBQAC4AQAhlAEBALUBACGVAQEAtQEAIZYBCADWAQAhlwEBALUBACGYAQEA4gEAIZkBAQC1AQAhmgEBALUBACELggEBAAAAAYMBAQAAAAWEAQEAAAAFhQEBAAAAAYYBAQAAAAGHAQEAAAABiAEBAAAAAYkBAQDGAQAhigEBAAAAAYsBAQAAAAGMAQEAAAABCAMAALkBACB2AADQAQAwdwAANQAQeAAA0AEAMHkBALUBACF6AQC1AQAhogEAADUAIKMBAAA1ACAAAAABpwEBAAAAAQGnAQAAAH4CAacBAAAAgAECAacBQAAAAAELGgAApwIAMBsAAKwCADCkAQAAqAIAMKUBAACpAgAwpgEAAKoCACCnAQAAqwIAMKgBAACrAgAwqQEAAKsCADCqAQAAqwIAMKsBAACtAgAwrAEAAK4CADALGgAAjwIAMBsAAJQCADCkAQAAkAIAMKUBAACRAgAwpgEAAJICACCnAQAAkwIAMKgBAACTAgAwqQEAAJMCADCqAQAAkwIAMKsBAACVAgAwrAEAAJYCADALGgAAgAIAMBsAAIUCADCkAQAAgQIAMKUBAACCAgAwpgEAAIMCACCnAQAAhAIAMKgBAACEAgAwqQEAAIQCADCqAQAAhAIAMKsBAACGAgAwrAEAAIcCADALGgAA7wEAMBsAAPQBADCkAQAA8AEAMKUBAADxAQAwpgEAAPIBACCnAQAA8wEAMKgBAADzAQAwqQEAAPMBADCqAQAA8wEAMKsBAAD1AQAwrAEAAPYBADAICwAA_wEAIHkBAAAAAYABAAAAoAECgQFAAAAAAZsBAQAAAAGcAQgAAAABngEAAACeAQKgAQEAAAABAgAAABYAIBoAAP4BACADAAAAFgAgGgAA_gEAIBsAAPwBACABEwAArgMAMA0IAADaAQAgCwAA2QEAIHYAANUBADB3AAAUABB4AADVAQAweQEAAAABgAEAANgBoAEigQFAALgBACGSAQEAtQEAIZsBAQAAAAGcAQgA1gEAIZ4BAADXAZ4BIqABAQC1AQAhAgAAABYAIBMAAPwBACACAAAA9wEAIBMAAPgBACALdgAA9gEAMHcAAPcBABB4AAD2AQAweQEAtQEAIYABAADYAaABIoEBQAC4AQAhkgEBALUBACGbAQEAtQEAIZwBCADWAQAhngEAANcBngEioAEBALUBACELdgAA9gEAMHcAAPcBABB4AAD2AQAweQEAtQEAIYABAADYAaABIoEBQAC4AQAhkgEBALUBACGbAQEAtQEAIZwBCADWAQAhngEAANcBngEioAEBALUBACEHeQEA5wEAIYABAAD7AaABIoEBQADqAQAhmwEBAOcBACGcAQgA-QEAIZ4BAAD6AZ4BIqABAQDnAQAhBacBCAAAAAGtAQgAAAABrgEIAAAAAa8BCAAAAAGwAQgAAAABAacBAAAAngECAacBAAAAoAECCAsAAP0BACB5AQDnAQAhgAEAAPsBoAEigQFAAOoBACGbAQEA5wEAIZwBCAD5AQAhngEAAPoBngEioAEBAOcBACEFGgAAqQMAIBsAAKwDACCkAQAAqgMAIKUBAACrAwAgqgEAAAEAIAgLAAD_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_AgAgGwAAvQIAIAETAACTAwAwAgAAAA4AIBMAAL0CACACAAAAiAIAIBMAALwCACAFeQEA5wEAIYEBQADqAQAhkAECAIoCACGRAQEA5wEAIZIBAQDnAQAhBggAAL4CACB5AQDnAQAhgQFAAOoBACGQAQIAigIAIZEBAQDnAQAhkgEBAOcBACEFGgAAjgMAIBsAAJEDACCkAQAAjwMAIKUBAACQAwAgqgEAAI0BACAGCAAAwAIAIHkBAAAAAYEBQAAAAAGQAQIAAAABkQEBAAAAAZIBAQAAAAEDGgAAjgMAIKQBAACPAwAgqgEAAI0BACAGCAAAywIAIA0AAKYCACB5AQAAAAGAAQAAAKIBAoEBQAAAAAGSAQEAAAABAgAAAAEAIBoAAMoCACADAAAAAQAgGgAAygIAIBsAAMgCACABEwAAjQMAMAIAAAABACATAADIAgAgAgAAAJcCACATAADHAgAgBHkBAOcBACGAAQAAmQKiASKBAUAA6gEAIZIBAQDnAQAhBggAAMkCACANAACcAgAgeQEA5wEAIYABAACZAqIBIoEBQADqAQAhkgEBAOcBACEFGgAAiAMAIBsAAIsDACCkAQAAiQMAIKUBAACKAwAgqgEAAI0BACAGCAAAywIAIA0AAKYCACB5AQAAAAGAAQAAAKIBAoEBQAAAAAGSAQEAAAABAxoAAIgDACCkAQAAiQMAIKoBAACNAQAgCwUAAM0CACAHAADOAgAgCgAAzwIAIHkBAAAAAYEBQAAAAAGUAQEAAAABlQEBAAAAAZYBCAAAAAGXAQEAAAABmAEBAAAAAZkBAQAAAAEDGgAAhgMAIKQBAACHAwAgqgEAADIAIAQaAADBAgAwpAEAAMICADCmAQAAxAIAIKoBAACTAgAwBBoAALYCADCkAQAAtwIAMKYBAAC5AgAgqgEAAIQCADAEGgAApwIAMKQBAACoAgAwpgEAAKoCACCqAQAAqwIAMAQaAACPAgAwpAEAAJACADCmAQAAkgIAIKoBAACTAgAwBBoAAIACADCkAQAAgQIAMKYBAACDAgAgqgEAAIQCADAEGgAA7wEAMKQBAADwAQAwpgEAAPIBACCqAQAA8wEAMAAAAAAAAAAAAAAAAAAAAAUaAACBAwAgGwAAhAMAIKQBAACCAwAgpQEAAIMDACCqAQAAjQEAIAMaAACBAwAgpAEAAIIDACCqAQAAjQEAIAAAAAAAAAAACxoAAO4CADAbAADyAgAwpAEAAO8CADClAQAA8AIAMKYBAADxAgAgpwEAAKsCADCoAQAAqwIAMKkBAACrAgAwqgEAAKsCADCrAQAA8wIAMKwBAACuAgAwCwYAAOQCACAHAADOAgAgCgAAzwIAIHkBAAAAAYEBQAAAAAGUAQEAAAABlQEBAAAAAZYBCAAAAAGXAQEAAAABmAEBAAAAAZoBAQAAAAECAAAABQAgGgAA9gIAIAMAAAAFACAaAAD2AgAgGwAA9QIAIAETAACAAwAwAgAAAAUAIBMAAPUCACACAAAArwIAIBMAAPQCACAIeQEA5wEAIYEBQADqAQAhlAEBAOcBACGVAQEA5wEAIZYBCAD5AQAhlwEBAOcBACGYAQEAsQIAIZoBAQDnAQAhCwYAAOMCACAHAAC0AgAgCgAAtQIAIHkBAOcBACGBAUAA6gEAIZQBAQDnAQAhlQEBAOcBACGWAQgA-QEAIZcBAQDnAQAhmAEBALECACGaAQEA5wEAIQsGAADkAgAgBwAAzgIAIAoAAM8CACB5AQAAAAGBAUAAAAABlAEBAAAAAZUBAQAAAAGWAQgAAAABlwEBAAAAAZgBAQAAAAGaAQEAAAABBBoAAO4CADCkAQAA7wIAMKYBAADxAgAgqgEAAKsCADAAAAADCAAA_AIAIAkAAP0CACANAAD-AgAgBAMAANQCACAHAADVAgAgCgAA1gIAIAwAANcCACAFBQAA_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_Cl2AASteggEGX4QBCmCFASxhhgEGYocBBmOIAQpkiwEtZYwBM2aOAQJnjwECaJIBAmmTAQJqlAECa5YBAmyYAQptmQE0bpsBAm-dAQpwngE1cZ8BAnKgAQJzoQEKdKQBNnWlATo"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("node:buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var Role = {
  TENANT: "TENANT",
  LANDLORD: "LANDLORD",
  ADMIN: "ADMIN"
};
var BookingStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  ACTIVE: "ACTIVE",
  PAID: "PAID"
};
var PaymentStatus = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED"
};
var PaymentProvider = {
  STRIPE: "STRIPE"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, expiresIn) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const verifyedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifyedToken
    };
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
};
var jwtUtils = {
  createToken,
  verifyToken
};

// src/models/auth/auth.service.ts
var registerUserDB = async (payload) => {
  const normalizedEmail = payload.email.toLowerCase().trim();
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: normalizedEmail
    }
  });
  if (isUserExist) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config_default.byrypt_salt_rounds)
  );
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: normalizedEmail,
      password: hashedPassword,
      role: payload.role
    },
    omit: {
      password: true
    }
  });
  return user;
};
var loginUserDB = async (payload) => {
  const email = payload.email.toLowerCase().trim();
  const { password } = payload;
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  if (user.status === "BANNED") {
    throw new Error("Your account has been banned. Please contact support.");
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }
  const accessToken = jwtUtils.createToken(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken2 = jwtUtils.createToken(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken2
  };
};
var googleLoginDB = async (idToken) => {
  if (!idToken) {
    throw new Error("Google token is required");
  }
  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
  );
  if (!res.ok) {
    throw new Error("Invalid or expired Google token");
  }
  const payload = await res.json();
  const { email, name, email_verified } = payload;
  if (!email || !email_verified) {
    throw new Error("Google email is not verified");
  }
  let user = await prisma.user.findUnique({
    where: { email }
  });
  if (user) {
    if (user.status === "BANNED") {
      throw new Error("Your account has been banned. Please contact support.");
    }
  } else {
    const randomPassword = await bcrypt.hash(
      Math.random().toString(36).slice(-10) + Date.now().toString(),
      Number(config_default.byrypt_salt_rounds) || 10
    );
    user = await prisma.user.create({
      data: {
        name: name || email.split("@")[0],
        email,
        password: randomPassword,
        role: "TENANT"
      }
    });
  }
  const accessToken = jwtUtils.createToken(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken2 = jwtUtils.createToken(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken2,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};
var getMeDB = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    omit: {
      password: true
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
var refreshTokenDB = async (refreshToken2) => {
  const verifiedRefreshtoken = jwtUtils.verifyToken(
    refreshToken2,
    config_default.jwt_refresh_secret
  );
  if (!verifiedRefreshtoken.success) {
    throw new Error(verifiedRefreshtoken.error);
  }
  const { id } = verifiedRefreshtoken.data;
  const user = await prisma.user.findFirst({
    where: {
      id
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.status === "BANNED") {
    throw new Error("User is Blocked");
  }
  const jwtpayload = {
    id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtpayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  return {
    accessToken
  };
};
var userService = {
  registerUserDB,
  loginUserDB,
  googleLoginDB,
  getMeDB,
  refreshTokenDB
};

// src/utils/sendResponce.ts
var sendResponse = (res, data) => {
  const response = {
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    meta: data.meta || null,
    data: data.data
  };
  return res.status(data.statusCode).json(response);
};

// src/models/auth/auth.controller.ts
var registerUser = catchAsync(
  async (req, res, next) => {
    const payload = req.body;
    const result = await userService.registerUserDB(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: result
    });
  }
);
var loginUser = catchAsync(
  async (req, res, next) => {
    const payload = req.body;
    const { accessToken, refreshToken: refreshToken2 } = await userService.loginUserDB(payload);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1e3 * 60 * 60 * 24 * 2
      // 2 days
    });
    res.cookie("refreshToken", refreshToken2, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1e3 * 60 * 60 * 24 * 7
      // 7 days
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User logged in successfully",
      data: {
        accessToken,
        refreshToken: refreshToken2
      }
    });
  }
);
var googleLogin = catchAsync(
  async (req, res, next) => {
    const { idToken } = req.body;
    const { accessToken, refreshToken: refreshToken2, user } = await userService.googleLoginDB(idToken);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1e3 * 60 * 60 * 24 * 2
    });
    res.cookie("refreshToken", refreshToken2, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1e3 * 60 * 60 * 24 * 7
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Google login successful",
      data: {
        accessToken,
        refreshToken: refreshToken2,
        user
      }
    });
  }
);
var getMe = catchAsync(
  async (req, res, next) => {
    const profile = await userService.getMeDB(req.user?.id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User profile retrieved successfully",
      data: profile
    });
  }
);
var refreshToken = catchAsync(
  async (req, res, next) => {
    const refreshToken2 = req.cookies.refreshToken;
    const { accessToken } = await userService.refreshTokenDB(refreshToken2);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1e3 * 60 * 60 * 24 * 2
      // 2 days
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Token Refreshed successfully",
      data: {
        accessToken
      }
    });
  }
);
var userController = {
  registerUser,
  loginUser,
  googleLogin,
  getMe,
  refreshToken
};

// src/midlewere/auth.ts
var auth = (...requiredRoles) => {
  return catchAsync(async (req, res, next) => {
    const token = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : req.headers.authorization;
    if (!token) {
      {
        throw new Error(
          "You are not logged in. Please log in to access this resource."
        );
      }
    }
    const verifiedToken = jwtUtils.verifyToken(token, config_default.jwt_access_secret);
    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }
    const { email, name, id, role } = verifiedToken.data;
    console.log("the role is ", role, requiredRoles);
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error(
        "Forbidden. You don't have permission to access this resource."
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        id,
        email,
        name,
        role
      }
    });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.status === "BANNED") {
      throw new Error("Your account has been banned. Please contact support.");
    }
    req.user = {
      email,
      name,
      id,
      role
    };
    next();
  });
};

// src/models/auth/auth.route.ts
var router = Router();
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/google", userController.googleLogin);
router.get(
  "/me",
  auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
  userController.getMe
);
router.post("/refresh-token", userController.refreshToken);
var userRouter = router;

// src/models/property/property.route.ts
import { Router as Router2 } from "express";

// src/models/property/porperty.service.ts
var createPropertyIntoDB = async (landlordId, payload) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: landlordId
    }
  });
  if (user.status === "BANNED") {
    throw new Error("You Dont have parmition to create proerty");
  }
  console.log("Payload:", payload);
  const properties = await prisma.property.create({
    data: {
      title: payload.title,
      location: payload.location,
      price: Number(payload.price),
      description: payload.description,
      image: payload.image,
      landlordId,
      categoryId: payload.categoryId
    },
    include: { category: true, landlord: { select: { id: true, name: true, email: true } }, reviews: true }
  });
  console.log("Create Data:", JSON.stringify(properties, null, 2));
  return properties;
};
var getAllPorpertiesFromDB = async (query) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const properties = await prisma.property.findMany({
    // sarchting and filtering
    where: {
      AND: [
        query.search ? {
          OR: [
            {
              title: {
                contains: query.search,
                mode: "insensitive"
              }
            },
            {
              description: {
                contains: query.search,
                mode: "insensitive"
              }
            },
            {
              location: {
                contains: query.search,
                mode: "insensitive"
              }
            }
          ]
        } : {},
        query.minPrice ? {
          price: {
            gte: Number(query.minPrice)
          }
        } : {},
        query.maxPrice ? {
          price: {
            lte: Number(query.maxPrice)
          }
        } : {}
      ]
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      reviews: true,
      category: true
    }
  });
  return properties;
};
var getLandlordPropertiesFromDB = async (landlordId) => {
  console.log("landlord id", landlordId);
  const result = await prisma.property.findMany({
    where: {
      landlordId
    }
  });
  return result;
};
var getSinglePropertyFromDB = async (propertyId) => {
  return prisma.property.findUniqueOrThrow({
    where: {
      id: propertyId
    },
    include: { category: true, landlord: { select: { id: true, name: true, email: true } }, reviews: true }
  });
};
var updatePropertiesIntoDB = async (id, payload, landloardId) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: landloardId
    }
  });
  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id
    }
  });
  if (user.status === "BANNED") {
    throw new Error("You Dont have parmition to create proerty");
  }
  if (user.role !== Role.ADMIN && property.landlordId !== user.id) {
    throw new Error("Unauthorized");
  }
  const updateResult = await prisma.property.update({
    where: {
      id
    },
    data: {
      title: payload.title,
      location: payload.location,
      price: Number(payload.price),
      description: payload.description,
      image: payload.image
    },
    omit: {
      id: true,
      landlordId: true
    },
    include: {
      reviews: true,
      category: {
        omit: {
          id: true
        }
      }
    }
  });
  return updateResult;
};
var deletePropertyFromDB = async (propertyId, landLordId) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: landLordId
    }
  });
  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id: propertyId
    }
  });
  if (user.status === "BANNED") {
    throw new Error("You Dont have parmition to create proerty");
  }
  if (user.role !== Role.ADMIN && property.landlordId !== user.id) {
    throw new Error("Unauthorized");
  }
  await prisma.property.delete({
    where: {
      id: propertyId
    },
    omit: {
      id: true,
      landlordId: true
    },
    include: {
      reviews: true,
      category: {
        omit: {
          id: true
        }
      }
    }
  });
};
var propertyService = {
  createPropertyIntoDB,
  getAllPorpertiesFromDB,
  updatePropertiesIntoDB,
  deletePropertyFromDB,
  getLandlordPropertiesFromDB,
  getSinglePropertyFromDB
};

// src/models/property/propery.controller.ts
import httpstatus from "http-status";
var createProperty = catchAsync(
  async (req, res, next) => {
    const payload = req.body;
    const landLordId = req.user?.id;
    console.log("the payload", payload);
    const result = await propertyService.createPropertyIntoDB(
      landLordId,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.CREATED,
      message: "User registered successfully",
      data: result
    });
  }
);
var getAllProperties = catchAsync(
  async (req, res, next) => {
    const query = req.query;
    const result = await propertyService.getAllPorpertiesFromDB(query);
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.CREATED,
      message: "all Properties registered successfully",
      data: result
    });
  }
);
var updateProperties = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const landLordId = req.user?.id;
    console.log("id is ", id);
    const payload = req.body;
    const result = await propertyService.updatePropertiesIntoDB(
      id,
      payload,
      landLordId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.CREATED,
      message: "Update Properties  successfully",
      data: result
    });
  }
);
var deleteProperty = async (req, res) => {
  const landLordId = req.user?.id;
  await propertyService.deletePropertyFromDB(
    req.params.id,
    landLordId
  );
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Property deleted successfully",
    data: null
  });
};
var getLandlordProperty = async (req, res) => {
  const landLordId = req.user?.id;
  console.log("controler landlerod id", landLordId);
  const result = await propertyService.getLandlordPropertiesFromDB(
    landLordId
  );
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Property deleted successfully",
    data: result
  });
};
var getSingleProperty = catchAsync(async (req, res) => {
  const result = await propertyService.getSinglePropertyFromDB(
    req.params.propertyId
  );
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Property retrieved successfully",
    data: result
  });
});
var propertyController = {
  createProperty,
  getAllProperties,
  updateProperties,
  deleteProperty,
  getLandlordProperty,
  getSingleProperty
};

// src/models/property/property.route.ts
var router2 = Router2();
router2.post(
  "/",
  auth(Role.ADMIN, Role.LANDLORD),
  propertyController.createProperty
);
router2.get("/", propertyController.getAllProperties);
router2.get(
  "/landlord-property",
  auth(Role.LANDLORD),
  propertyController.getLandlordProperty
);
router2.put(
  "/:id",
  auth(Role.ADMIN, Role.LANDLORD),
  propertyController.updateProperties
);
router2.delete(
  "/:id",
  auth(Role.ADMIN, Role.LANDLORD),
  propertyController.deleteProperty
);
router2.get("/:propertyId", propertyController.getSingleProperty);
var propertyRouter = router2;

// src/models/category/category.route.ts
import { Router as Router3 } from "express";

// src/models/category/category.service.ts
var createCategoryIntoDB = async (payload) => {
  const category = await prisma.category.create({
    data: payload
  });
  return category;
};
var getAllCategoriesFromDB = async () => {
  return await prisma.category.findMany({
    orderBy: {
      name: "asc"
    }
  });
};
var getSingleCategoryFromDB = async (id) => {
  return await prisma.category.findUniqueOrThrow({
    where: {
      id
    }
  });
};
var categoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB
};

// src/models/category/categroy.controller.ts
import httpstatus2 from "http-status";
var createCategory = catchAsync(
  async (req, res, next) => {
    const result = await categoryService.createCategoryIntoDB(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpstatus2.OK,
      message: "Category created successfully",
      data: result
    });
  }
);
var getAllCategories = catchAsync(
  async (req, res, next) => {
    const result = await categoryService.getAllCategoriesFromDB();
    sendResponse(res, {
      success: true,
      statusCode: httpstatus2.OK,
      message: "Categories retrieved successfully",
      data: result
    });
  }
);
var getSingleCategory = catchAsync(
  async (req, res, next) => {
    const result = await categoryService.getSingleCategoryFromDB(
      req.params.id
    );
    sendResponse(res, {
      success: true,
      statusCode: httpstatus2.OK,
      message: "Category retrieved successfully",
      data: result
    });
  }
);
var categoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory
};

// src/models/category/category.route.ts
var router3 = Router3();
router3.post("/", auth(Role.ADMIN), categoryController.createCategory);
router3.get("/", categoryController.getAllCategories);
router3.get("/:id", categoryController.getSingleCategory);
var categoryRoutes = router3;

// src/models/bookings/booking.route.ts
import { Router as Router4 } from "express";

// src/models/bookings/booking.service.ts
var createBookingIntoDB = async (userId, payload) => {
  const existingBooking = await prisma.booking.findFirst({
    where: {
      userId,
      propertyId: payload.propertyId,
      status: {
        in: ["PENDING", "APPROVED"]
      }
    }
  });
  if (existingBooking) {
    throw new Error("You have already booked this property.");
  }
  const result = await prisma.booking.create({
    data: {
      userId,
      propertyId: payload.propertyId
    },
    include: {
      property: true,
      user: {
        omit: {
          password: true
        }
      }
    }
  });
  return result;
};
var getAllBookingsFromDB = async (query) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  return await prisma.booking.findMany({
    where: {
      AND: [
        query.search ? {
          OR: [
            {
              user: {
                name: {
                  contains: query.search,
                  mode: "insensitive"
                }
              }
            },
            {
              property: {
                title: {
                  contains: query.search,
                  mode: "insensitive"
                }
              }
            }
          ]
        } : {}
      ]
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      property: true,
      user: true,
      payment: true
    }
  });
};
var getSingleBookingFromDB = async (id) => {
  return await prisma.booking.findUniqueOrThrow({
    where: {
      id
    },
    include: {
      property: true,
      user: true,
      payment: true
    }
  });
};
var getLandlordBookingsFromDB = async (landlordId) => {
  return await prisma.booking.findMany({
    where: {
      property: {
        landlordId
      }
    },
    include: {
      user: true,
      property: true,
      payment: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getTenantBookingsFromDB = async (tenantId) => {
  return await prisma.booking.findMany({
    where: {
      userId: tenantId
    },
    include: {
      user: true,
      property: true,
      payment: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var updateBookingStatusIntoDB = async (bookingId, status) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId
    },
    include: {
      property: true
    }
  });
  return await prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      status
    },
    include: {
      user: true,
      property: true,
      payment: true
    }
  });
};
var updateBookingIntoDB = async (id, payload) => {
  return await prisma.booking.update({
    where: {
      id
    },
    data: {
      status: payload.status
    },
    include: {
      property: true,
      user: true,
      payment: true
    }
  });
};
var deleteBookingFromDB = async (id) => {
  return await prisma.booking.delete({
    where: {
      id
    }
  });
};
var bookingService = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  getSingleBookingFromDB,
  updateBookingIntoDB,
  deleteBookingFromDB,
  updateBookingStatusIntoDB,
  getLandlordBookingsFromDB,
  getTenantBookingsFromDB
};

// src/models/bookings/booking.controller.ts
import httpStatus2 from "http-status";
var createBooking = catchAsync(
  async (req, res, next) => {
    const payload = req.body;
    const result = await bookingService.createBookingIntoDB(
      req.user.id,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus2.CREATED,
      message: "Booking created successfully",
      data: result
    });
  }
);
var getAllBookings = catchAsync(
  async (req, res, next) => {
    const query = req.query;
    const result = await bookingService.getAllBookingsFromDB(query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus2.OK,
      message: "Bookings retrieved successfully",
      data: result
    });
  }
);
var getSingleBooking = catchAsync(
  async (req, res, next) => {
    const id = req.params.id;
    const result = await bookingService.getSingleBookingFromDB(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus2.OK,
      message: "Booking retrieved successfully",
      data: result
    });
  }
);
var getLandlordBookings = catchAsync(
  async (req, res, next) => {
    const landlordId = req.user.id;
    const result = await bookingService.getLandlordBookingsFromDB(landlordId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus2.OK,
      message: "Landlord bookings retrieved successfully",
      data: result
    });
  }
);
var getTenantBookings = catchAsync(
  async (req, res, next) => {
    const tenantId = req.user.id;
    const result = await bookingService.getTenantBookingsFromDB(tenantId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus2.OK,
      message: "Tenant bookings retrieved successfully",
      data: result
    });
  }
);
var updateBookingStatus = catchAsync(
  async (req, res, next) => {
    const bookingId = req.params.id;
    const result = await bookingService.updateBookingStatusIntoDB(
      bookingId,
      req.body.status
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus2.OK,
      message: "Booking status updated successfully",
      data: result
    });
  }
);
var updateBooking = catchAsync(
  async (req, res, next) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await bookingService.updateBookingIntoDB(
      id,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus2.OK,
      message: "Booking updated successfully",
      data: result
    });
  }
);
var deleteBooking = catchAsync(async (req, res) => {
  const id = req.params.id;
  await bookingService.deleteBookingFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus2.OK,
    message: "Booking deleted successfully",
    data: null
  });
});
var bookingController = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
  getLandlordBookings,
  getTenantBookings
};

// src/models/bookings/booking.route.ts
var router4 = Router4();
router4.post("/", auth(Role.TENANT), bookingController.createBooking);
router4.get("/", auth(Role.ADMIN), bookingController.getAllBookings);
router4.get(
  "/landlord",
  auth(Role.LANDLORD),
  bookingController.getLandlordBookings
);
router4.get("/tenant", auth(Role.TENANT), bookingController.getTenantBookings);
router4.patch(
  "/:id/status",
  auth(Role.LANDLORD, Role.ADMIN),
  bookingController.updateBookingStatus
);
router4.get(
  "/:id",
  auth(Role.ADMIN, Role.TENANT),
  bookingController.getSingleBooking
);
router4.patch("/:id", auth(Role.ADMIN), bookingController.updateBooking);
router4.delete("/:id", auth(Role.ADMIN), bookingController.deleteBooking);
var bookingRoute = router4;

// src/midlewere/notFound.ts
var notFound = (req, res, next) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    date: Date()
  });
};

// src/midlewere/globalErrorHandler.ts
import httpstatus3 from "http-status";
var globalErrorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(httpstatus3.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: httpstatus3.INTERNAL_SERVER_ERROR,
    message: err.message,
    error: err
  });
};

// src/models/reviews/reviews.route.ts
import { Router as Router5 } from "express";

// src/models/reviews/reviews.service.ts
var createReviewIntoDB = async (userId, payload) => {
  const result = await prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      propertyId: payload.propertyId,
      userId
    },
    include: {
      user: true,
      property: true
    }
  });
  return result;
};
var getAllReviewsFromDB = async () => {
  return await prisma.review.findMany({
    include: {
      user: true,
      property: true
    }
  });
};
var deleteReviewFromDB = async (id) => {
  return await prisma.review.delete({
    where: {
      id
    }
  });
};
var reviewService = {
  createReviewIntoDB,
  getAllReviewsFromDB,
  deleteReviewFromDB
};

// src/models/reviews/reviews.controller.ts
import httpStatus3 from "http-status";
var createReview = catchAsync(
  async (req, res, next) => {
    const result = await reviewService.createReviewIntoDB(
      req.user.id,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus3.CREATED,
      message: "Review created successfully",
      data: result
    });
  }
);
var getAllReviews = catchAsync(
  async (req, res, next) => {
    const result = await reviewService.getAllReviewsFromDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus3.OK,
      message: "Reviews retrieved successfully",
      data: result
    });
  }
);
var deleteReview = catchAsync(
  async (req, res, next) => {
    await reviewService.deleteReviewFromDB(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus3.OK,
      message: "Review deleted successfully",
      data: null
    });
  }
);
var reviewController = {
  createReview,
  getAllReviews,
  deleteReview
};

// src/models/reviews/reviews.route.ts
var router5 = Router5();
router5.post("/", auth(Role.TENANT), reviewController.createReview);
router5.get("", reviewController.getAllReviews);
router5.delete(
  "/:id",
  auth(Role.ADMIN, Role.TENANT),
  reviewController.deleteReview
);
var reviewRouter = router5;

// src/models/payments/payments.route.ts
import { Router as Router6 } from "express";

// src/lib/stripe.ts
import Stripe from "stripe";
var stripe = new Stripe(config_default.stripe_secret_key);

// src/models/payments/payment.service.ts
var createCheckoutSessionIntoDB = async (userId, bookingId) => {
  const trensitionResult = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUniqueOrThrow({
      where: {
        id: bookingId
      },
      include: {
        property: true
      }
    });
    if (booking.userId !== userId) {
      throw new Error("Unauthorized");
    }
    if (booking.status !== BookingStatus.APPROVED) {
      throw new Error("Booking is not approved.");
    }
    const rawClientUrl = config_default.client_url || process.env.CLIENT_URL || process.env.FRONTEND_APP_URL || "http://localhost:3000";
    const cleanClientUrl = rawClientUrl.replace(/\/+$/, "");
    const baseClientUrl = cleanClientUrl.startsWith("http://") || cleanClientUrl.startsWith("https://") ? cleanClientUrl : `http://${cleanClientUrl}`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: booking.property.price * 100,
            product_data: {
              name: booking.property.title,
              description: booking.property.description
            }
          }
        }
      ],
      metadata: {
        bookingId: booking.id,
        userId: booking.userId
      },
      success_url: `${baseClientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseClientUrl}/payment/cancel`
    });
    return session.url;
  });
  return trensitionResult;
};
var handleWebhook = async (payload, signature) => {
  const endpointSecret = config_default.stripe_webhook_secret;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret
  );
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;
      const userId = session.metadata?.userId;
      console.log(session);
      console.log(session.metadata);
      if (session.payment_status !== "paid") {
        throw new Error("Payment failed.");
      }
      if (!bookingId || !userId) {
        throw new Error("Invalid metadata");
      }
      await prisma.$transaction(async (tx) => {
        const existingPayment = await tx.payment.findUnique({
          where: {
            bookingId
          }
        });
        if (existingPayment) {
          return;
        }
        await tx.payment.create({
          data: {
            bookingId,
            userId,
            amount: (session.amount_total ?? 0) / 100,
            provider: PaymentProvider.STRIPE,
            status: PaymentStatus.SUCCESS,
            transactionId: session.payment_intent
          }
        });
        await tx.booking.update({
          where: {
            id: bookingId
          },
          data: {
            status: BookingStatus.PAID
          }
        });
      });
      break;
    default:
      console.log(`No Events Matched ${event.type}.`);
      break;
  }
};
var paymentService = {
  createCheckoutSessionIntoDB,
  handleWebhook
};

// src/models/payments/payment.controller.ts
import httpStatus4 from "http-status";
var createCheckoutSession = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    const bookingId = req.params.id;
    const result = await paymentService.createCheckoutSessionIntoDB(
      userId,
      bookingId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus4.OK,
      message: "Pyment has been successfull",
      data: result
    });
  }
);
var handleWebhook2 = catchAsync(
  async (req, res, next) => {
    const event = req.body;
    const signature = req.headers["stripe-signature"];
    await paymentService.handleWebhook(event, signature);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus4.OK,
      message: "Webhook Triggered successfull",
      data: null
    });
  }
);
var paymentController = {
  createCheckoutSession,
  handleWebhook: handleWebhook2
};

// src/models/payments/payments.route.ts
var router6 = Router6();
router6.post(
  "/checkout/:id",
  auth(Role.TENANT, Role.ADMIN, Role.LANDLORD),
  paymentController.createCheckoutSession
);
router6.post("/webhook", paymentController.handleWebhook);
var paymentRouter = router6;

// src/models/admin/admin.route.ts
import { Router as Router7 } from "express";

// src/models/admin/admin.controller.ts
import httpstatus4 from "http-status";

// src/models/admin/admin.service.ts
var getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany();
  return result;
};
var changeUserStatus = async (userId, status) => {
  if (!["ACTIVE", "BANNED"].includes(status)) {
    throw new Error("Invalid status. Use 'active' or 'banned'.");
  }
  const user = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      status
    }
  });
  return user;
};
var adminServices = {
  getAllUsersFromDB,
  changeUserStatus
};

// src/models/admin/admin.controller.ts
var getAllUsers = catchAsync(
  async (req, res, next) => {
    const result = await adminServices.getAllUsersFromDB();
    sendResponse(res, {
      success: true,
      statusCode: httpstatus4.OK,
      message: "Retrive All Users Successfully",
      data: result
    });
  }
);
var updateUserStatus = catchAsync(
  async (req, res, next) => {
    const { id, status } = req.body;
    const result = await adminServices.changeUserStatus(id, status);
    sendResponse(res, {
      success: true,
      statusCode: httpstatus4.OK,
      message: `Change the user Status as ${result.status}`,
      data: result
    });
  }
);
var adminController = { getAllUsers, updateUserStatus };

// src/models/admin/admin.route.ts
var router7 = Router7();
router7.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router7.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserStatus);
var adminRoutr = router7;

// src/models/ai/ai.route.ts
import { Router as Router8 } from "express";

// src/models/ai/ai.controller.ts
import httpStatus5 from "http-status";

// src/models/ai/ai.service.ts
async function callGroqAI(messages, preferredModel = "openai/gpt-oss-120b") {
  const apiKey = config_default.groq_api_key;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured in environment variables.");
  }
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: preferredModel,
        messages,
        temperature: 0.7,
        max_tokens: 1200
      })
    });
    if (!res.ok) {
      if (preferredModel !== "openai/gpt-oss-20b") {
        return callGroqAI(messages, "openai/gpt-oss-20b");
      }
      const err = await res.text();
      throw new Error(`Groq API error (${res.status}): ${err}`);
    }
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || "";
  } catch (error) {
    if (preferredModel !== "openai/gpt-oss-20b") {
      return callGroqAI(messages, "openai/gpt-oss-20b");
    }
    throw error;
  }
}
var chatAssistant = async (message, history = []) => {
  const properties = await prisma.property.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } }
    }
  });
  const propertyContext = properties.map(
    (p) => `- ID: "${p.id}", Title: "${p.title}", Price: \u09F3${Number(
      p.price
    ).toLocaleString()}/month, Location: "${p.location}", Category: "${p.category?.name || "Apartment"}", Snippet: "${p.description.slice(0, 100)}..."`
  ).join("\n");
  const systemPrompt = `You are "NestBot", the intelligent AI Concierge for RentNest (rentnest.com), Bangladesh's premier luxury & modern home rental platform.
You are warm, knowledgeable, professional, and genuinely helpful.
You can communicate naturally in English, Bengali (\u09AC\u09BE\u0982\u09B2\u09BE), or Banglish depending on how the user writes.

Here are the actual live properties available right now on RentNest:
${propertyContext}

Your capabilities & rules:
1. When a user asks for property recommendations, budget options, or locations (e.g. Gulshan, Banani, Dhanmondi, Uttara, Bashundhara, Mirpur), suggest matching homes from the live list above.
2. For each recommendation, provide:
   - The property title
   - Price in BDT (\u09F3)
   - Location
   - A clickable markdown link formatted strictly as: [View Property Details](/properties/PROPERTY_ID)
3. If the user asks about rental policies, security deposits, lease terms in Bangladesh, or RentNest features (like verified landlords, direct booking, secure payments), answer clearly and reassuringly.
4. If a landlord asks how to list their home, explain the simple steps to register as Landlord and click "Add Property".
5. Keep your tone polite, concise, structured with bullet points where appropriate, and avoid overwhelming text walls.`;
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-6).map((h) => ({
      role: h.role,
      content: h.content
    })),
    { role: "user", content: message }
  ];
  const reply = await callGroqAI(messages);
  return { reply };
};
var generateListing = async (input) => {
  const systemPrompt = `You are an elite real estate copywriter and listing optimizer for RentNest, a premium property rental platform.
Your task is to take brief keywords, rough landlord notes, or partial property information, and generate a polished, compelling, high-converting property listing.

Rules:
- Generate a captivating, elegant title (under 10 words).
- Generate a descriptive, beautifully written description (2-3 paragraphs) highlighting lifestyle, comfort, space, natural lighting, and security.
- Suggest 4-6 realistic feature highlights/bullet points (e.g., "24/7 Security & CCTV", "Standby Generator Support", "Dedicated Car Parking", "Elevator Access").
- If price is missing or 0, suggest a realistic monthly rent in BDT (Bangladeshi Taka) suitable for the location and category.
- Output MUST be valid JSON only, without any markdown code fences or backticks, with the following structure:
{
  "title": "string",
  "description": "string",
  "highlights": ["string", "string", "string", "string"],
  "suggestedPrice": number
}`;
  const userContent = `Landlord notes & draft info:
- Quick keywords/notes: ${input.prompt || "Modern rental property"}
- Draft title: ${input.title || "Not specified"}
- Location: ${input.location || "Dhaka, Bangladesh"}
- Category: ${input.categoryName || "Apartment"}
- Provided Price: ${input.price ? `\u09F3${input.price}` : "Not specified"}`;
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userContent }
  ];
  const raw2 = await callGroqAI(messages, "openai/gpt-oss-120b");
  let cleanJson = raw2.trim();
  if (cleanJson.startsWith("```json")) {
    cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleanJson.startsWith("```")) {
    cleanJson = cleanJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  try {
    const parsed = JSON.parse(cleanJson);
    return parsed;
  } catch (err) {
    return {
      title: input.title || "Modern Luxurious Living Space",
      description: raw2,
      highlights: [
        "Prime Location & Secure Neighborhood",
        "Spacious Natural Lighting",
        "Modern Fittings & Amenities",
        "Dedicated Maintenance Support"
      ],
      suggestedPrice: input.price || 35e3
    };
  }
};
var smartSearch = async (query) => {
  const properties = await prisma.property.findMany({
    take: 20,
    include: {
      category: { select: { name: true } }
    }
  });
  const propertyContext = properties.map(
    (p) => `- ID: "${p.id}", Title: "${p.title}", Price: \u09F3${Number(
      p.price
    )}, Location: "${p.location}", Category: "${p.category?.name || "Apartment"}"`
  ).join("\n");
  const systemPrompt = `You are a real estate search matcher. Given a user's natural language search query, match up to 5 best properties from the available list.
Properties available:
${propertyContext}

Return JSON ONLY (no markdown fences):
{
  "matchedIds": ["id1", "id2"],
  "summary": "Brief 1-2 sentence explanation of why these match"
}`;
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `User query: "${query}"` }
  ];
  const raw2 = await callGroqAI(messages, "openai/gpt-oss-20b");
  let cleanJson = raw2.trim();
  if (cleanJson.startsWith("```json")) {
    cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleanJson.startsWith("```")) {
    cleanJson = cleanJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  try {
    const parsed = JSON.parse(cleanJson);
    const matchedProperties = properties.filter(
      (p) => parsed.matchedIds?.includes(p.id)
    );
    return {
      matches: matchedProperties,
      summary: parsed.summary
    };
  } catch (e) {
    return {
      matches: properties.slice(0, 4),
      summary: "Here are top available properties matching your interest."
    };
  }
};
var aiService = {
  chatAssistant,
  generateListing,
  smartSearch
};

// src/models/ai/ai.controller.ts
var chat = catchAsync(async (req, res) => {
  const { message, history } = req.body;
  if (!message || typeof message !== "string") {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus5.BAD_REQUEST,
      message: "A valid 'message' string is required",
      data: null
    });
  }
  const result = await aiService.chatAssistant(message, history || []);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.OK,
    message: "AI response generated successfully",
    data: result
  });
});
var generateListing2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await aiService.generateListing(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.OK,
    message: "Listing generated successfully",
    data: result
  });
});
var smartSearch2 = catchAsync(async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== "string") {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus5.BAD_REQUEST,
      message: "A valid 'query' string is required",
      data: null
    });
  }
  const result = await aiService.smartSearch(query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.OK,
    message: "Smart search matches found",
    data: result
  });
});
var aiController = {
  chat,
  generateListing: generateListing2,
  smartSearch: smartSearch2
};

// src/models/ai/ai.route.ts
var router8 = Router8();
router8.post("/chat", aiController.chat);
router8.post("/generate-listing", aiController.generateListing);
router8.post("/smart-search", aiController.smartSearch);
var aiRouter = router8;

// src/app.ts
var app = express();
var allowedOrigins = [
  config_default.client_url,
  config_default.app_url,
  "http://localhost:3000",
  "http://localhost:5000"
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true
  })
);
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", userRouter);
app.use("/api/property", propertyRouter);
app.use("/api/categories", categoryRoutes);
app.use("/api/bookings", bookingRoute);
app.use("/api/reviews", reviewRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/admin", adminRoutr);
app.use("/api/ai", aiRouter);
app.get("/", (req, res) => {
  res.send("hello world");
});
app.use(notFound);
app.use(globalErrorHandler);
var app_default = app;
export {
  app_default as default
};
