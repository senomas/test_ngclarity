import * as express from "express";

import { Models } from "../models/models";

import { GenericRouter } from "./generic";

import { UserRouter } from "./user";

export class Routers {
  constructor(private models: Models) {}

  user = new UserRouter(this.models);

  generic = new GenericRouter(this.models);
}
