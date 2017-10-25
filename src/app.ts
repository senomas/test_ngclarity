import * as path from "path";
import * as express from "express";
import * as compression from "compression";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import * as proxy from "express-http-proxy";

import { Config } from "./config";

import faker = require("faker");
import errorHandler = require("errorhandler");
import mongoose = require("mongoose");

import { Models } from "./models/models";
import { Meta } from "./.models/meta.model";

import { Routers } from "./routers/routers";

import * as forge from "node-forge"

const config = Config();

class App {
  public express: express.Application;
  private models: Models;

  VERSION: string = "0.9.0.6-DEV";

  constructor() {
    this.express = express();
    this.init()
      .then(() => {
        console.log("INIT DONE");
      })
      .catch(err => console.error(err));
  }

  private async init() {
    try {
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
      let ver: Meta = (await this.models.meta.findOne({ id: "VERSION" }).exec());
      if (ver != null) {
        if (ver.value !== this.VERSION) {
          console.error("NEW VERSION", ver);
          await this.models.dropCollections();
          await this.initDB();
          ver.value = this.VERSION;
          await this.models.meta.update({ id: ver.id }, ver).exec();
        }
      } else {
        console.error("INIT VERSION", ver);
        await this.models.dropCollections();
        await this.initDB();
        ver = { id: "VERSION", value: this.VERSION };
        await this.models.meta.create(ver);
      }

      this.middleware();
      this.routes();
    } catch (err) {
      throw err;
    }
  }

  private async initDB() {
    console.log("initDB");
    if (await this.models.user.count({}) == 0) {
      let objs: any[] = [];
      let hmac = forge.hmac.create();
      for (let i = 0; i < 1000; i++) {
        let user = faker.helpers.contextualCard();
        let geo = user.address.geo;
        if (i === 5) {
          user.username = "seno";
          user.roles = ["user.list", "user.edit", "user.create", "user.delete"];
        } else if (i == 6) {
          user.username = "dodol";
          user.roles = ["operator"];
        } else if (i == 7) {
          user.username = "duren";
          user.roles = ["user"];
        }
        user.address.geo = [geo.lng, geo.lat];
        hmac.start('sha256', user.username);
        hmac.update("dodol123");
        user.password = forge.util.encode64(hmac.digest().getBytes());
        console.log("USER", user);
        objs.push(user);
      }
      await this.models.user.insertMany(objs);
    }
  }

  private middleware(): void {
    this.express.disable("x-powered-by");
    this.express.use(logger("dev"));
    this.express.use((err, req, res, next) => {
      console.error("\n\n\nMW ERR", err, err.stack);
      if (req.xhr) {
        req.status(500).json({ "message": "Unknown error" });
      } else {
        next(err);
      }
    });
    this.express.use(errorHandler());
    this.express.use(compression());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes(): void {
    let router = express.Router();
    let routers = new Routers(this.models);

    // router.get("/api/v1/user/:id", routers.user.findById);
    // router.post("/api/v1/user", routers.user.create);
    // router.post("/api/v1/user/find", routers.user.find);

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
