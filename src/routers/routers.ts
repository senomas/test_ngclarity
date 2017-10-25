import * as express from "express";

import { Models } from "../models/models";

import { GenericRouter } from "./generic";

import { AuthRouter } from "./auth";

export class Routers {
  constructor(private models: Models) { }

  generic = new GenericRouter(this.models);

  auth = new AuthRouter(this.models);

}
