import { Types } from "mongoose";

import { Models } from "../models/models";

import * as express from "express";

export class GenericRouter {
  constructor(private models: Models) { }

  create = (req, res, next): void => {
    let model = this.models[req.params.model];
    if (!model) {
      res.status(404).send(`Unknown model '${req.params.model}'`);
      return;
    }
    model
      .create(req.body)
      .then(v => {
        res.json(v);
      })
      .catch(err => {
        console.log("ERROR", err);
        res.status(500).send(err);
      });
  };

  update = (req, res, next): void => {
    let model = this.models[req.params.model];
    if (!model) {
      res.status(404).send(`Unknown model '${req.params.model}'`);
      return;
    }
    model
      .update({ _id: Types.ObjectId(req.params.id) }, req.body)
      .then(v => {
        res.json(v);
      })
      .catch(err => {
        console.log("ERROR", err);
        res.status(500).send(err);
      });
  };

  delete = (req, res, next): void => {
    let model = this.models[req.params.model];
    if (!model) {
      res.status(404).send(`Unknown model '${req.params.model}'`);
      return;
    }
    model
      .findByIdAndRemove(Types.ObjectId(req.params.id))
      .exec()
      .then(result => {
        if (!result) {
          res.status(404).send("No object");
          return;
        }
        res.json(result);
      })
      .catch(err => {
        console.log("ERROR", err);
        res.status(500).send(err);
      });
  };

  deleteMany = (req, res, next): void => {
    let model = this.models[req.params.model];
    if (!model) {
      res.status(404).send(`Unknown model '${req.params.model}'`);
      return;
    }
    model
      .remove({
        _id: { $in: (req.body as string[]).map(v => Types.ObjectId(v)) }
      })
      .exec()
      .then(result => res.json(result))
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
    model
      .findById(Types.ObjectId(req.params.id))
      .exec()
      .then(result => {
        if (!result) {
          res.status(404).send("No object");
          return;
        }
        res.json(result);
      })
      .catch(err => {
        console.log("ERROR", err);
        res.status(500).send(err);
      });
  };

  find = (req, res, next): void => {
    let param = req.body;
    let model = this.models[req.params.model];
    if (!model) {
      res.status(404).send(`Unknown model '${req.params.model}'`);
      return;
    }
    let start = param.page.from || 0;
    let condition: any = {};
    let sort: any;
    if (param.sort) {
      sort = {};
      sort[param.sort.by] = param.sort.reverse ? -1 : 1;
    }
    let filters: any[] = param.filters;
    if (filters) {
      filters.forEach(element => {
        condition[element.property] = new RegExp(element.value, "i");
      });
    }
    Promise.all([
      model.count(condition).exec(),
      model
        .find(condition)
        .limit(param.page.size || 10)
        .skip(start)
        .sort(sort)
        .exec()
    ])
      .then(results => {
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
