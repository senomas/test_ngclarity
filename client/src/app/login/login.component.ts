import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AppService } from "../app.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  user: any = {};

  constructor(private appSvc: AppService, private router: Router) {}

  ngOnInit() {}

  login() {
    this.appSvc
      .login(this.user)
      .then(v => {
        console.log("USER IS", JSON.stringify(v));
        this.router.navigate(["home"]);
      })
      .catch(err => console.log("ERROR", err));
  }
}
