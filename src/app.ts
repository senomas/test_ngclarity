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

const config = Config();

class App {
  public express: express.Application;
  private models: Models;

  VERSION: string = "0.9.0.1-DEV";

  constructor() {
    this.express = express();
    this.init().then(() => {
      console.log("INIT DONE");
    }).catch(err => console.error(err));
  }

  private async init() {
    try {
      mongoose.Promise = global.Promise;
      mongoose.set("debug", true);

      this.models = new Models(
        mongoose.createConnection(config.db.server || "mongodb://mongo:27017/admin", {
          useMongoClient: true,
          user: config.db.user || "admin",
          pass: config.db.password || "dodol123"
        })
      );
      let ver: Meta[] = await this.models.meta.find({ id: "VERSION" }).exec() as Meta[];
      if (ver.length > 0) {
        if (ver[0].value.endsWith("-DEV")) {
          console.error("DEV VERSION", ver);
          await this.models.dropCollections();
          await this.initDB();
        } else if (ver[0].value !== this.VERSION) {
          console.error("NEW VERSION", ver);
          await this.models.dropCollections();
          await this.initDB();
        }
      } else {
        console.error("INIT VERSION", ver);
        await this.models.dropCollections();
        await this.initDB();
      }

      this.middleware();
      this.routes();
    } catch (err) {
      throw err;
    }
  }

  private async initDB() {
    console.log("initDB");
    this.models.user.count({}, (err, count) => {
      if (count == 0) {
        let objs: any[] = [];
        for (let i = 0; i < 33; i++) {
          let user = faker.helpers.contextualCard();
          let geo = user.address.geo;
          user.address.geo = [geo.lng, geo.lat];
          console.log("USER", user);
          objs.push(user);
        }
        this.models.user.insertMany(objs, (err, res) => {
          console.log("INSERTS", err);
        });
      }
    });
  }

  private middleware(): void {
    this.express.disable("x-powered-by");
    this.express.use(logger("dev"));
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
