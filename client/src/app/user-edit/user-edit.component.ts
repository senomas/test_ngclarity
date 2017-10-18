import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";

import { AppService, State } from "../app.service";
import { EditComponent } from "../shared/edit.component";
import { User } from "../models/user.model";

@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"]
})
export class UserEditComponent extends EditComponent<User> implements OnInit {
  constructor(
    appSvc: AppService,
    route: ActivatedRoute,
    router: Router,
    location: Location
  ) {
    super("user", appSvc, route, router, location);
  }

  ngOnInit() {}
}
