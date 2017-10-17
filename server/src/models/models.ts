import { Model } from "mongoose";

import { User, UserModel, userSchema } from "./user";

import mongoose = require("mongoose");

export class Models {
  constructor(private conn: mongoose.Connection) {}

  user: Model<UserModel> = this.conn.model<UserModel>("users", userSchema);
}
