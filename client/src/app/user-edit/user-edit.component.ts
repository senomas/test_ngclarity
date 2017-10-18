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
  user: User = {};

  warning: any;

  constructor(
    private appSvc: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.route.params.subscribe(param => {
      if (param.id) {
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
      } else {
        this.user = {};
      }
    });
  }

  ngOnInit() {}

  onSubmit() {
    if ((this.user as any)._id) {
      this.appSvc
        .updateUser(this.user)
        .then(() => this.onBack())
        .catch(err => {
          if (err.statusText) {
            this.warning = err.statusText;
          } else {
            this.warning = "Unknown error";
          }
        });
    } else {
      this.appSvc
        .saveUser(this.user)
        .then(() => this.onBack())
        .catch(err => {
          if (err.statusText) {
            this.warning = err.statusText;
          } else {
            this.warning = "Unknown error";
          }
        });
    }
  }

  clearWarning() {
    this.warning = undefined;
  }

  onBack() {
    this.location.back();
  }
}
