import { Types } from "mongoose";

import { Models } from "../models/models";

import { User } from "../models/user";

import * as express from "express";

export class UserRouter {
  constructor(private models: Models) {}

  create = (req, res, next): void => {
    new this.models.user(req.body)
      .save()
      .then(v => {
        res.json(v);
      })
      .catch(err => {
        console.log("ERROR", err);
        res.status(500).send(err);
      });
  };

  findById = (req, res, next): void => {
    this.models.user
      .findById(Types.ObjectId(req.params.id))
      .exec((err, result) => {
        if (err) {
          res.status(500).send(err);
          return;
        }
        if (!result) {
          res.status(404).send("No object");
          return;
        }
        res.json(result);
      });
  };

  find = (req, res, next): void => {
    this.models["user"]
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
}
