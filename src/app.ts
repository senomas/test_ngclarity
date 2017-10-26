import * as path from "path";
import * as express from "express";
import * as compression from "compression";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import * as proxy from "express-http-proxy";

import { config } from "./config";

import errorHandler = require("errorhandler");
import mongoose = require("mongoose");

import { Models } from "./models/models";
import { Meta } from "./.models/meta.model";

import { Routers } from "./routers/routers";

class App {
  public express: express.Application;
  private models: Models;

  constructor() {
    this.express = express();
    this.init().catch(err => console.error(err));
  }

  private async init() {
    mongoose.Promise = global.Promise;
    mongoose.set("debug", true);

    this.models = new Models(
      mongoose.createConnection(
        config.db.server || "mongodb://mongo:27017/admin",
        {
          useMongoClient: true,
          user: config.db.user || "admin",
          pass: config.db.password || "dodol123"
        }
      )
    );

    this.middleware();
  }

  private middleware(): void {
    this.express.disable("x-powered-by");
    this.express.use(logger("dev"));
    this.express.use(compression());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.routes();
    this.express.use((err, req, res, next) => {
      if (err.name === "TokenExpiredError") {
        res.status(403).json({ name: err.name, message: "token expired" });
      } else if (err.name === "NoPermissionError") {
        res.status(403).json({ name: err.name, message: err.message });
      } else if (err.name === "TokenRefreshError") {
        res.status(401).json({ name: err.name, message: err.message });
      } else if (err.name && err.message) {
        res.status(500).json({ name: err.name, message: err.message });
      } else {
        console.error("\n\nMW ERR", err);
        next(err);
      }
    });
    this.express.use(errorHandler());
  }

  private routes(): void {
    let router = express.Router();
    let routers = new Routers(this.models);

    router.get("/api/auth/:username", routers.auth.init);
    router.post("/api/auth/:username", routers.auth.login);
    router.get("/api/auth/:token/user", routers.auth.user);
    router.get("/api/auth/:token/refresh", routers.auth.refreshToken);

    router.get("/api/:model", routers.generic.find);
    router.post("/api/:model", routers.generic.create);
    router.patch("/api/:model/:id", routers.generic.update);
    router.get("/api/:model/:id", routers.generic.findById);
    router.post("/api/:model/find", routers.generic.find);
    router.delete("/api/:model/:id", routers.generic.delete);
    router.post("/api/:model/delete", routers.generic.deleteMany);

    // router.use("/", express.static(path.join(__dirname, "client")));
    router.use("/", proxy("localhost:4200"));

    this.express.use("/", router);
  }
}

export default new App().express;
