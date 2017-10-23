import { Document, Schema } from "mongoose";

import { User } from "./user.model";

export interface UserModel extends User, Document { }

export var userSchema: Schema = new Schema({
  name: { type: String, index: true },
  username: { type: String, index: { unique: true } },
  avatar: String,
  email: { type: String, index: { unique: true } },
  dob: Date,
  phone: String,
  address: {
    street: String,
    suite: String,
    city: String,
    zipcode: String,
    geo: {
      lat: String,
      lng: String
    }
  },
  website: String,
  company: {
    name: String,
    catchPhrase: String,
    bs: String
  },
  createdAt: Date
});

userSchema.pre("save", function (next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});
