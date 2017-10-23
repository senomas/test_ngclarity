import { Model } from "mongoose";

import { Meta } from "./meta.model"
import { MetaModel, metaSchema } from "./meta"

import { User } from "./user.model";
import { UserModel, userSchema } from "./user";

import { ProductModel, productSchema } from "./product";
import { Product } from "./product.model";

import mongoose = require("mongoose");

export class Models {
  constructor(public conn: mongoose.Connection) { }

  meta: Model<MetaModel> = this.conn.model<MetaModel>("metas", metaSchema);

  user: Model<UserModel> = this.conn.model<UserModel>("users", userSchema);

  product: Model<ProductModel> = this.conn.model<ProductModel>(
    "products",
    productSchema
  );
}
