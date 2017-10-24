import { Model, Schema } from "mongoose";

import { Meta } from "../.models/meta.model"
import { MetaModel, MetaSchema } from "../.models/meta"

import { User } from "../.models/user.model";
import { UserModel, UserSchema } from "../.models/user";

import { ProductModel, ProductSchema } from "../.models/product";
import { Product } from "../.models/product.model";

import { ParamsModel, ParamsSchema } from "../.models/params";
import { Params } from "../.models/params.model";

import * as mongoose from "mongoose";

export class Models {
  constructor(public conn: mongoose.Connection) { }

  meta: Model<MetaModel> = this.conn.model<MetaModel>("metas", MetaSchema);

  user: Model<UserModel> = this.conn.model<UserModel>("users", UserSchema);

  product: Model<ProductModel> = this.conn.model<ProductModel>(
    "products",
    ProductSchema
  );

  params: Model<ParamsModel> = this.conn.model<ParamsModel>("params", ParamsSchema);

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
      this[id].collection.drop().then(() => {
        resolve();
      }).catch(err => {
        setTimeout(() => {
          this[id].collection.drop().then(() => {
            resolve();
          }).catch(err => console.log(err));
        }, 5000);
      })
    });
  }

}