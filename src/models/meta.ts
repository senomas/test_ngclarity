import { Document, Schema } from "mongoose";

import { Meta } from "./meta.model";

export interface MetaModel extends Meta, Document { }

export var metaSchema: Schema = new Schema({
  id: { type: String, index: { unique: true } },
  version: String,
  createdAt: Date
});

metaSchema.pre("save", function (next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});
