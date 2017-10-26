import { Model, Schema } from "mongoose";

import { VERSION, config } from "../config";

import { Meta } from "../.models/meta.model";
import { MetaModel, MetaSchema } from "../.models/meta";

import { User } from "../.models/user.model";
import { UserModel, UserSchema } from "../.models/user";

import { Role } from "../.models/role.model";
import { RoleModel, RoleSchema } from "../.models/role";

import { Auth } from "../.models/auth.model";
import { AuthModel, AuthSchema } from "../.models/auth";

import { ProductModel, ProductSchema } from "../.models/product";
import { Product } from "../.models/product.model";

import { AddressModel, AddressSchema } from "../.models/address";
import { Address } from "../.models/address.model";

import { BlogModel, BlogSchema } from "../.models/blog";
import { Blog } from "../.models/blog.model";

import { ParamsModel, ParamsSchema } from "../.models/params";
import { Params } from "../.models/params.model";

import * as faker from "faker";
import * as mongoose from "mongoose";
import * as jwt from "jsonwebtoken";
import * as forge from "node-forge"

export class Models {
  meta: Model<MetaModel> = this.conn.model<MetaModel>("metas", MetaSchema);

  user: Model<UserModel> = this.conn.model<UserModel>("users", UserSchema);

  role: Model<RoleModel> = this.conn.model<RoleModel>("roles", RoleSchema);

  auth: Model<AuthModel> = this.conn.model<AuthModel>("auths", AuthSchema);

  product: Model<ProductModel> = this.conn.model<ProductModel>(
    "products",
    ProductSchema
  );

  address: Model<AddressModel> = this.conn.model<AddressModel>(
    "address",
    AddressSchema
  );

  blog: Model<BlogModel> = this.conn.model<BlogModel>("blog", BlogSchema);

  params: Model<ParamsModel> = this.conn.model<ParamsModel>(
    "params",
    ParamsSchema
  );

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

    setTimeout((async () => {
      console.log("INIT DATA...");
      let ver: Meta = (await this.meta.findOne({ id: "VERSION" }).exec());
      if (ver != null) {
        if (ver.value !== VERSION) {
          console.error("NEW VERSION", ver);
          await this.dropCollections();
          await this.initDB();
          ver.value = VERSION;
          await this.meta.update({ id: ver.id }, ver).exec();
        }
      } else {
        console.error("INIT VERSION", ver);
        await this.dropCollections();
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
          user.roles = ["user.create", "user.read", "user.update", "user.delete"];
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
  }

  get(req, access: string, permissions: string[] = null): Model<any> {
    let auth = req.headers.authorization;
    if (!auth) throw new NoUserError("need login");
    if (!auth.startsWith("Bearer ")) throw new NoUserError("need login");
    let token = jwt.verify(auth.slice(7).trim(), config.auth.secret);
    if (!token.role.some(v => v === "role:root")) {
      if (!permissions) permissions = [];
      permissions.push(`${req.params.model}.${access}`);
      permissions.forEach(p => {
        if (!token.role.some(v => v === p)) {
          throw new NoPermissionError(`Dont have "${p}" permission.`);
        }
      })
    }
    let model = this[req.params.model];
    if (!model) throw new NoModelError(`Unknown model '${req.params.model}'`);
    return model;
  }

  dropCollections(): Promise<any> {
    let drops = [];
    for (let pk in this) {
      if (pk === "conn") {
        // skip
      } else {
        drops.push(this.dropCollection(pk));
      }
    }
    console.log("DROPS", drops);
    return Promise.all(drops);
  }

  dropCollection(id: string): Promise<void> {
    return new Promise((resolve, err) => {
      this[id].collection
        .drop()
        .then(() => {
          resolve();
        })
        .catch(err => {
          setTimeout(() => {
            this[id].collection
              .drop()
              .then(() => {
                resolve();
              })
              .catch(err => console.log(err));
          }, 5000);
        });
    });
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

