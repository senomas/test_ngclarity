import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";

import { AppService, User, State } from "../app.service";

@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"]
})
export class UserEditComponent implements OnInit {
  user: User;

  constructor(
    private appSvc: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.route.params.subscribe(param => {
      this.appSvc
        .getUser(param.id)
        .then(v => {
          console.log("USER", v);
          this.user = v;
        })
        .catch(err => {
          console.log("ERROR", err);
          // this.router.navigate(["user"]);
        });
    });
  }

  ngOnInit() {}

  onSubmit() {
    this.appSvc
      .updateUser(this.user)
      .then(() => this.onBack())
      .catch(err => console.log(err));
  }

  onBack() {
    this.location.back();
  }
}
