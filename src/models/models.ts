import { Model, Schema } from "mongoose";

import { Meta } from "../.models/meta.model";
import { MetaModel, MetaSchema } from "../.models/meta";

import { User } from "../.models/user.model";
import { UserModel, UserSchema } from "../.models/user";

import { ProductModel, ProductSchema } from "../.models/product";
import { Product } from "../.models/product.model";

import { AddressModel, AddressSchema } from "../.models/address";
import { Address } from "../.models/address.model";

import { BlogModel, BlogSchema } from "../.models/blog";
import { Blog } from "../.models/blog.model";

import * as mongoose from "mongoose";

export class Models {
  constructor(public conn: mongoose.Connection) {}

  meta: Model<MetaModel> = this.conn.model<MetaModel>("metas", MetaSchema);

  user: Model<UserModel> = this.conn.model<UserModel>("users", UserSchema);

  product: Model<ProductModel> = this.conn.model<ProductModel>(
    "products",
    ProductSchema
  );

  address: Model<AddressModel> = this.conn.model<AddressModel>(
    "address",
    AddressSchema
  );

  blog: Model<BlogModel> = this.conn.model<BlogModel>("blog", BlogSchema);
}
