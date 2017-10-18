import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AppService, State } from "../app.service";
import { ListComponent } from "../shared/list.component";
import { User } from "../models/user.model";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"]
})
export class UserListComponent extends ListComponent<User> implements OnInit {
  constructor(appSvc: AppService, router: Router) {
    super("user", appSvc, router);
  }

  ngOnInit() {}
}
