import { Model, Schema } from "mongoose";

import { Meta } from "./meta.model"
import { MetaModel, MetaSchema } from "./meta"

import { User } from "./user.model";
import { UserModel, UserSchema } from "./user";

import { ProductModel, ProductSchema } from "./product";
import { Product } from "./product.model";

import * as mongoose from "mongoose";

export class Models {
  constructor(public conn: mongoose.Connection) { }

  meta: Model<MetaModel> = this.conn.model<MetaModel>("metas", MetaSchema);

  user: Model<UserModel> = this.conn.model<UserModel>("users", UserSchema);

  product: Model<ProductModel> = this.conn.model<ProductModel>(
    "products",
    ProductSchema
  );
}