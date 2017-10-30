import { Model, Schema } from "mongoose";

import { VERSION, config } from "../config";

import * as fs from "fs";
import * as yaml from "yamljs";
import * as faker from "faker";
import * as mongoose from "mongoose";
import * as jwt from "jsonwebtoken";
import * as forge from "node-forge"

export class Models {
  private _models: any = {};

  meta: Model<any>;

  auth: Model<any>;

  user: Model<any>;

  constructor(public conn: mongoose.Connection) {
    conn.on('connected', function () {
      console.log('Mongoose default connection open');
    });

    conn.on('error', function (err) {
      console.log('Mongoose default connection error: ' + err);
    });

    conn.on('disconnected', function () {
      console.log('Mongoose default connection disconnected');
    });

    fs.readdirSync(`${__dirname}`).forEach(f => {
      if (f.endsWith(".yaml")) {
        try {
          let id = f.slice(0, -5);
          let schemaConfig = yaml.load(`${__dirname}/${f}`);
          delete schemaConfig.$view;
          console.log(`FILE: ${id}`, JSON.stringify(schemaConfig, undefined, 2));
          this._models[id] = this.conn.model(id, new Schema(schemaConfig));
        } catch (err) {
          console.error(`ERROR LOADING SCHEMA ${f}`, err);
          throw err;
        }
      }
    });
    this.meta = this._models.meta;
    this.user = this._models.user;
    this.auth = this._models.auth;

    setTimeout((async () => {
      console.log("INIT DATA...");
      let ver = (await this.meta.findOne({ id: "VERSION" }).exec());
      if (ver != null) {
        if (ver.value !== VERSION) {
          console.error("NEW VERSION", ver);
          await this.initDB();
          ver.value = VERSION;
          await this.meta.update({ id: ver.id }, ver).exec();
        } else {
          await this.initDB();
        }
      } else {
        console.error("INIT VERSION", ver);
        await this.initDB();
        ver = { id: "VERSION", value: VERSION };
        await this.meta.create(ver);
      }
      console.log("INIT DONE");
    }), 1000);
  }

  private async initDB() {
    console.log("initDB");
    if (await this.user.count({}) == 0) {
      let objs: any[] = [];
      let hmac = forge.hmac.create();
      for (let i = 0; i < 1000; i++) {
        let user = faker.helpers.contextualCard();
        let geo = user.address.geo;
        if (i === 5) {
          user.username = "seno";
          user.roles = ["root", "admin", "operator", "user"];
        } else if (i == 6) {
          user.username = "dodol";
          user.roles = ["operator"];
        } else if (i == 7) {
          user.username = "duren";
          user.roles = ["user"];
        }
        user.address.geo = [geo.lng, geo.lat];
        hmac.start('sha256', user.username);
        hmac.update("dodol123");
        user.password = forge.util.encode64(hmac.digest().getBytes());
        console.log("USER", user);
        objs.push(user);
      }
      await this.user.insertMany(objs);
    }
    ["admin", "operator", "user"].forEach(async rn => {
      let role = await this._models.role.findOne({ name: rn });
      if (!role) {
        role = { name: rn };
        this._models.role.create(role);
      }
    });
    console.log("initDB DONE");
  }

  get(req, access: string, permissions: string[] = null): Model<any> {
    let auth = req.headers.authorization;
    if (!auth) throw new NoUserError("need login");
    if (!auth.startsWith("Bearer ")) throw new NoUserError("need login");
    let token = jwt.verify(auth.slice(7).trim(), config.auth.secret);
    if (!token.role.some(v => v === "root")) {
      if (!permissions) permissions = [];
      permissions.push(`${req.params.model}.${access}`);
      permissions.forEach(p => {
        if (!token.role.some(v => v === p)) {
          throw new NoPermissionError(`Dont have "${p}" permission.`);
        }
      })
    }
    let model = this._models[req.params.model];
    if (!model) throw new NoModelError(`Unknown model '${req.params.model}'`);
    return model;
  }
}

export class NoUserError extends Error {
  name = 'NoUserError';

  constructor(msg: string) {
    super(msg);
  }
}

export class NoModelError extends Error {
  name = 'NoModelError';

  constructor(msg: string) {
    super(msg);
  }
}

export class NoPermissionError extends Error {
  name = 'NoPermissionError';

  constructor(msg: string) {
    super(msg);
  }
}

