import { Types } from "mongoose";

import { Models } from "../models/models";

import * as express from "express";

export class GenericRouter {
  constructor(private models: Models) {}

  create = (req, res, next): void => {
    let model = this.models[req.params.model];
    if (!model) {
      res.status(404).send(`Unknown model '${req.params.model}'`);
      return;
    }
    model
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
    let model = this.models[req.params.model];
    if (!model) {
      res.status(404).send(`Unknown model '${req.params.model}'`);
      return;
    }
    model.findById(Types.ObjectId(req.params.id)).exec((err, result) => {
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
    let model = this.models[req.params.model];
    if (!model) {
      res.status(404).send(`Unknown model '${req.params.model}'`);
      return;
    }
    Promise.all([
      model.count(req.body).exec(),
      model
        .find(req.body)
        .limit(+req.query.limit || 10)
        .skip(+req.query.skip || 0)
        .exec()
    ])
      .then(results => {
        console.log("VALUES", JSON.stringify(results));
        let start = +req.query.skip || 0;
        let count = results[1].length;
        let total = +results[0];
        res.json({
          start: start,
          first: start === 0,
          last: start + count >= total,
          total: total,
          list: results[1]
        });
      })
      .catch(err => {
        res.status(500).send(err);
      });
  };
}
