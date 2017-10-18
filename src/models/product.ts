import { Document, Schema } from "mongoose";

import { Product } from "./product.model";

export interface ProductModel extends Product, Document {}

export var productSchema: Schema = new Schema({
  id: String,
  name: String,
  description: String,
  createdAt: Date
});

productSchema.pre("save", function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});
