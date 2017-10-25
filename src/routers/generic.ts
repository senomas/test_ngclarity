import { Types } from "mongoose";

import { Models } from "../models/models";

import { Config } from "../config";

import * as express from "express";
import * as jwt from "jsonwebtoken";

const config = Config();

export class GenericRouter {
  constructor(private models: Models) { }

  async getRoles(req): Promise<string[]> {
    let auth = req.headers.authorization;
    if (!auth) throw "need login";
    if (!auth.startsWith("Bearer ")) throw "need login";
    let token = jwt.verify(auth.slice(7).trim(), config.auth.secret);
    let user = await this.models.user.findOne({ username: token.sub });
    console.log(`USER ${JSON.stringify(user)}`)
    return user.roles;
  }

  create = async (req, res, next) => {
    try {
      let model = this.models[req.params.model];
      if (!model) {
        res.status(404).send(`Unknown model '${req.params.model}'`);
        return;
      }
      res.json(await model.create(req.body))
    } catch (err) {
      console.log("ERROR", err);
      if (err.name === "MongoError" && err.code && err.message) {
        res.status(500).json({ code: err.code, message: err.message });
      } else {
        res.status(500).json(err);
      }
    }
  };

  update = async (req, res, next) => {
    try {
      let model = this.models[req.params.model];
      if (!model) {
        res.status(404).send(`Unknown model '${req.params.model}'`);
        return;
      }
      res.json(await model.update({ _id: Types.ObjectId(req.params.id) }, req.body));
    } catch (err) {
      console.log("ERROR", err);
      if (err.name === "MongoError" && err.code && err.message) {
        res.status(500).json({ code: err.code, message: err.message });
      } else {
        res.status(500).json(err);
      }
    }
  };

  delete = async (req, res, next) => {
    try {
      let model = this.models[req.params.model];
      if (!model) {
        res.status(404).send(`Unknown model '${req.params.model}'`);
        return;
      }
      let result = await model
        .findByIdAndRemove(Types.ObjectId(req.params.id))
        .exec();
      if (!result) {
        res.status(404).send("No object");
        return;
      }
      res.json(result);
    } catch (err) {
      console.log("ERROR", err);
      if (err.name === "MongoError" && err.code && err.message) {
        res.status(500).json({ code: err.code, message: err.message });
      } else {
        res.status(500).json(err);
      }
    }
  };

  deleteMany = async (req, res, next) => {
    try {
      let model = this.models[req.params.model];
      if (!model) {
        res.status(404).send(`Unknown model '${req.params.model}'`);
        return;
      }
      res.json(await model
        .remove({
          _id: { $in: (req.body as string[]).map(v => Types.ObjectId(v)) }
        })
        .exec());
    } catch (err) {
      console.log("ERROR", err);
      if (err.name === "MongoError" && err.code && err.message) {
        res.status(500).json({ code: err.code, message: err.message });
      } else {
        res.status(500).json(err);
      }
    }
  };

  findById = async (req, res, next) => {
    try {
      let model = this.models[req.params.model];
      if (!model) {
        res.status(404).send(`Unknown model '${req.params.model}'`);
        return;
      }
      let result = await model.findById(Types.ObjectId(req.params.id)).exec();
      if (!result) {
        res.status(404).send("No object");
        return;
      }
      res.json(result);
    } catch (err) {
      console.log("ERROR", err);
      if (err.name === "MongoError" && err.code && err.message) {
        res.status(500).json({ code: err.code, message: err.message });
      } else {
        res.status(500).json(err);
      }
    }
  };

  find = async (req, res, next) => {
    try {
      if (!(await this.getRoles(req)).some((v) => {
        console.log(`CHECK ROLE "${v}"==="${req.params.model}.list"`);
        return v === `${req.params.model}.list`
      })) {
        res.status(401).json({ message: "Not authorized" });
        return
      }
      let model = this.models[req.params.model];
      if (!model) {
        res.status(404).send(`Unknown model '${req.params.model}'`);
        return;
      }
      let start: number = 0;
      let size: number = 10;
      let condition: any = {};
      let sort: any = {};
      if (req.method === "GET") {
        start = +req.query.from || 0;
        size = +req.query.size || 10;
        if (req.query.sort) {
          sort[req.query.sort] = typeof req.query.desc !== 'undefined' ? -1 : 1;
        }
        if (req.query.filters) {
          let filters: any[] = JSON.parse(req.query.filters);
          filters.forEach(element => {
            condition[element.property] = new RegExp(element.value, "i");
          });
        }
        for (let k in req.query) {
          if (k.startsWith("f:")) {
            condition[k.slice(2)] = new RegExp(req.query[k], "i");
          }
        }
        console.log("CONDITION", condition);
      } else {
        let param = req.body;
        start = param.page.from || 0;
        size = param.page.size || 10;
        if (param.sort) {
          sort[param.sort.by] = param.sort.reverse ? -1 : 1;
        }
        if (param.filters) {
          (param.filters as any[]).forEach(element => {
            condition[element.property] = new RegExp(element.value, "i");
          });
        }
      }
      let results = await Promise.all([
        model.count(condition).exec(),
        model
          .find(condition)
          .limit(size)
          .skip(start)
          .sort(sort)
          .exec()
      ]);
      let count = results[1].length;
      let total = +results[0];
      res.json({
        start: start,
        first: start === 0,
        last: start + count >= total,
        total: total,
        list: results[1]
      });
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        res.status(403).json({ name: err.name, message: err.message });
      } else if (err.name === "MongoError" && err.code && err.message) {
        console.log("ERROR", err);
        res.status(500).json({ name: err.name, message: err.message, code: err.code });
      } else {
        console.log("ERROR", err);
        res.status(500).json(err);
      }
    }
  };
}
