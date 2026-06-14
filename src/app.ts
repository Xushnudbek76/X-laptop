import express = require("express");
import path from "path";
import routerAdmin from "./router-admin";
import router from "./router";
import morgan = require("morgan");
import { MORGAN_FORMAT } from "./libs/config";
import session = require("express-session");
import ConnectMongoDB = require("connect-mongodb-session");
import { T } from "./libs/types/common";
import cors = require("cors");

import dotenv from "dotenv";
import cookieParser = require("cookie-parser");
dotenv.config();

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
  uri: String(process.env.MONGO_URI),
  collection: "sessions",
});

/** 1-ENTRANCE **/
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("./uploads"));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT));

/** 2-SESSIONS **/
app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 1000 * 3600 * 3,
    },
    store: store,
    resave: true,
    saveUninitialized: false,
  }),
);

app.use(function (req, res, next) {
  const sessionsInstance = req.session as T;
  res.locals.member = sessionsInstance.member;
  next();
});

/** 3-VIEWS **/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/** 4-ROUTERS **/
app.get("/health", (_req, res) => {
  res.status(200).send("ok");
});

app.use("/admin", routerAdmin);
app.use("/", router);
export default app;
