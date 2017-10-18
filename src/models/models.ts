import { Model } from "mongoose";

import { User } from "./user.model";
import { UserModel, userSchema } from "./user";

import { ProductModel, productSchema } from "./product";
import { Product } from "./product.model";

import mongoose = require("mongoose");

export class Models {
  constructor(private conn: mongoose.Connection) {}

  user: Model<UserModel> = this.conn.model<UserModel>("users", userSchema);

  product: Model<ProductModel> = this.conn.model<ProductModel>(
    "products",
    productSchema
  );
}
