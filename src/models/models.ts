import { Model } from "mongoose";

import { User, UserModel, userSchema } from "./user";

import { Product, ProductModel, productSchema } from "./product";

import mongoose = require("mongoose");

export class Models {
  constructor(private conn: mongoose.Connection) {}

  user: Model<UserModel> = this.conn.model<UserModel>("users", userSchema);

  product: Model<ProductModel> = this.conn.model<ProductModel>(
    "products",
    productSchema
  );
}
