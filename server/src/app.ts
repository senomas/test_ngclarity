import * as path from "path";
import * as express from "express";
import * as logger from "morgan";
import * as bodyParser from "body-parser";

import faker = require("faker");
import errorHandler = require("errorhandler");
import mongoose = require("mongoose");

import { Models } from "./models/models";

class App {
  public express: express.Application;
  private models: Models;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();

    this.express.use(errorHandler());

    mongoose.Promise = global.Promise;

    let conn: mongoose.Connection = mongoose.createConnection(
      "mongodb://localhost:27017/btnhack",
      { user: "btnhack", pass: "dodol123" }
    );

    this.models = new Models(conn);

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
  }

  private middleware(): void {
    this.express.use(logger("dev"));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes(): void {
    let router = express.Router();
    router.get("/", (req, res, next) => {
      res.json({
        message: "Hello World!"
      });
    });

    router.post("/user", (req, res, next) => {
      console.log("Post user ", JSON.stringify(req.body));
      new this.models.user(req.body)
        .save()
        .then(v => {
          console.log("DODOL", v);
          res.json(v);
        })
        .catch(err => {
          console.log("ERROR", err);
          res.status(500).send(err);
        });
    });

    let userFind = (req, res, next) => {
      console.log("Find users", JSON.stringify(req.body));
      this.models.user
        .find(req.body)
        .limit(+req.query.limit || 10)
        .skip(+req.query.skip || 0)
        .exec((err, results) => {
          if (err) {
            res.status(500).send(err);
            return;
          }
          res.json(results);
        });
    };

    router
      .route("/users")
      .get(userFind)
      .post(userFind);

    this.express.use("/", router);
  }
}

export default new App().express;
