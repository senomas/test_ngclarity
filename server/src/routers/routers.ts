import * as express from "express";

import { Models } from "../models/models";

import { UserRouter } from "./user";

export class Routers {
  constructor(private models: Models) {}

  user = new UserRouter(this.models);
}
