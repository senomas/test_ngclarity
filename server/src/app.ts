import * as path from "path";
import * as express from "express";
import * as compression from "compression";
import * as logger from "morgan";
import * as bodyParser from "body-parser";

import faker = require("faker");
import errorHandler = require("errorhandler");
import mongoose = require("mongoose");

import { Models } from "./models/models";

import { Routers } from "./routers/routers";

class App {
  public express: express.Application;
  private models: Models;

  constructor() {
    mongoose.Promise = global.Promise;
    mongoose.set("debug", true);

    this.models = new Models(
      mongoose.createConnection("mongodb://localhost:27017/btnhack", {
        user: "btnhack",
        pass: "dodol123"
      })
    );
    this.models.user.count({}, (err, count) => {
      if (count == 0) {
        let objs: any[] = [];
        for (let i = 0; i < 1000; i++) {
          objs.push({
            email: faker.internet.email(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
          });
        }
        this.models.user.insertMany(objs, (err, res) => {
          console.log("INSERTS", err);
        });
      }
    });

    this.express = express();

    this.middleware();
    this.routes();
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

    router.get("/", (req, res, next) => {
      res.json({
        message: "Hello World!"
      });
    });

    // router.get("/user/:id", routers.user.findById);
    // router.post("/user", routers.user.create);
    // router.post("/user/find", routers.user.find);

    router.post("/:model", routers.generic.create);
    router.patch("/:model/:id", routers.generic.update);
    router.get("/:model/:id", routers.generic.findById);
    router.post("/:model/find", routers.generic.find);
    router.delete("/:model/:id", routers.generic.delete);

    this.express.use("/", router);
  }
}

export default new App().express;
