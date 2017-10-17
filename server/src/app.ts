import * as path from "path";
import * as express from "express";
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
    this.express.use(errorHandler());

    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(logger("dev"));
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

    router.get("/:model/:id", routers.generic.findById);
    router.post("/:model", routers.generic.create);
    router.post("/:model/find", routers.generic.find);

    this.express.use("/", router);
  }
}

export default new App().express;
