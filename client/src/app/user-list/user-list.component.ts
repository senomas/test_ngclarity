import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import * as moment from "moment";

import { AppService, State } from "../app.service";
import { User, User_UI } from "../models/user.model";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"]
})
export class UserListComponent implements OnInit {
  ui = User_UI;

  ngOnInit() {}
}
