import * as path from "path";
import * as express from "express";
import * as compression from "compression";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import * as proxy from "express-http-proxy";

import faker = require("faker");
import errorHandler = require("errorhandler");
import mongoose = require("mongoose");

import { Models } from "./models/models";
import { Meta } from "./models/meta.model";

import { Routers } from "./routers/routers";

class App {
  public express: express.Application;
  private models: Models;

  VERSION: string = "0.9.0.1";

  constructor() {
    this.express = express();
    this.init().then(() => {
      console.log("INIT DONE");
    }).catch(err => console.error(err));
  }

  private async init() {
    try {
      console.log("HERE 1");
      mongoose.Promise = global.Promise;
      mongoose.set("debug", true);

      console.log("HERE 2");
      this.models = new Models(
        mongoose.createConnection("mongodb://mongo:27017/btnhack", {
          user: "btnhack",
          pass: "dodol123"
        })
      );
      console.log("HERE 3", this.models.meta);
      let ver: Meta[] = await this.models.meta.find({ id: "VERSION" }).exec() as Meta[];
      if (ver.length == 0) {
        ver.push({ id: "VERSION", value: this.VERSION });
        let res = await this.models.meta.create(ver);
        console.log("RES", res);
      } else if (ver[0].value !== this.VERSION) {
        console.error("OLD VERSION", ver);
      } else if (ver[0].value.startsWith("0.")) {
        console.error("BETA VERSION", ver);
        await this.clearDB();
        await this.initDB();
      } else {
        console.error("CURRENT VERSION", ver);
      }

      this.middleware();
      this.routes();
    } catch (err) {
      throw err;
    }
  }

  private async clearDB() {
    console.log("clearDB");
    await this.models.user.collection.drop();
    await this.models.product.collection.drop();
  }

  private async initDB() {
    console.log("initDB");
    this.models.user.count({}, (err, count) => {
      if (count == 0) {
        let objs: any[] = [];
        for (let i = 0; i < 1000; i++) {
          let user = faker.helpers.contextualCard();
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
