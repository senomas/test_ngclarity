import { Types } from "mongoose"

import { Models, NoPermissionError } from "../models/models"

import * as express from "express"
import * as jwt from "jsonwebtoken"

export class GenericRouter {
  constructor(private models: Models) {
  }

  create = afn(async (req, res, next) => {
    let model = this.models.get(req, "create")
    res.json(await model.create(req.body))
  })

  update = afn(async (req, res, next) => {
    let model = this.models.get(req, "update")
    res.json(await model.update({ _id: Types.ObjectId(req.params.id) }, req.body))
  })

  delete = afn(async (req, res, next) => {
    let model = this.models.get(req, "delete")
    let result = await model.findByIdAndRemove(Types.ObjectId(req.params.id)).exec()
    if (!result) {
      res.status(404).send("No object")
      return
    }
    res.json(result)
  })

  deleteMany = afn(async (req, res, next) => {
    let model = this.models.get(req, "delete")
    res.json(
      await model
        .remove({
          _id: { $in: (req.body as string[]).map(v => Types.ObjectId(v)) }
        })
        .exec()
    )
  })

  findById = afn(async (req, res, next) => {
    let model = this.models.get(req, "read")
    let result = await model.findById(Types.ObjectId(req.params.id)).exec()
    if (!result) {
      res.status(404).send("No object")
      return
    }
    res.json(result)
  })

  find = afn(async (req, res, next) => {
    let model = this.models.get(req, "read")
    let start: number = 0
    let size: number = 10
    let condition: any = {}
    let sort: any = {}
    if (req.method === "GET") {
      start = +req.query.from || 0
      size = +req.query.size || 10
      if (req.query.sort) {
        sort[req.query.sort] = typeof req.query.desc !== "undefined" ? -1 : 1
      }
      if (req.query.filters) {
        let filters: any[] = JSON.parse(req.query.filters)
        filters.forEach(element => {
          condition[element.property] = new RegExp(element.value, "i")
        })
      }
      for (let k in req.query) {
        if (k.startsWith("f:")) {
          condition[k.slice(2)] = new RegExp(req.query[k], "i")
        }
      }
      console.log("CONDITION", condition)
    } else {
      let param = req.body
      start = param.page.from || 0
      size = param.page.size || 10
      if (param.sort) {
        sort[param.sort.by] = param.sort.reverse ? -1 : 1
      }
      if (param.filters) {
        (param.filters as any[]).forEach(element => {
          condition[element.property] = new RegExp(element.value, "i")
        })
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
    ])
    let count = results[1].length
    let total = +results[0]
    res.json({
      start: start,
      first: start === 0,
      last: start + count >= total,
      total: total,
      list: results[1]
    })
  })
}

const afn = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
