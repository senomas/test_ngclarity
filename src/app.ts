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

import { Routers } from "./routers/routers";

class App {
  public express: express.Application;
  private models: Models;

  constructor() {
    mongoose.Promise = global.Promise;
    mongoose.set("debug", true);

    this.models = new Models(
      mongoose.createConnection("mongodb://mongo:27017/btnhack", {
        user: "btnhack",
        pass: "dodol123"
      })
    );
    this.models.user.count({}, (err, count) => {
      if (count == 0) {
        let objs: any[] = [];
        for (let i = 0; i < 1000; i++) {
          let bd = new Date();
          bd.setTime(
            bd.getTime() - Math.floor(Math.random() * 75 * 365 * 24 * 3600000)
          );
          let email = faker.internet.email();
          objs.push({
            id: email,
            email: email,
            firstName: faker.name.firstName(),
            birthdate: bd,
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
