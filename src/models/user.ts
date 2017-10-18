import { Document, Schema } from "mongoose";

import { User } from "./user.model";

export interface UserModel extends User, Document {}

export var userSchema: Schema = new Schema({
  id: String,
  email: String,
  firstName: String,
  lastName: String,
  birthdate: Date,
  createdAt: Date
});

userSchema.pre("save", function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});
