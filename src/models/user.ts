import { Document, Schema } from "mongoose";

export interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
}

export interface UserModel extends User, Document {}

export var userSchema: Schema = new Schema({
  id: String,
  email: String,
  firstName: String,
  lastName: String,
  createdAt: Date
});

userSchema.pre("save", function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});
