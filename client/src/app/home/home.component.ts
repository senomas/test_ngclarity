import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { AppService } from "../app.service";

@Component({
  styleUrls: ["./home.component.scss"],
  templateUrl: "./home.component.html"
})
export class HomeComponent {
  constructor(private router: Router, public appSvc: AppService) {}

  ngOnInit() {
    console.log("AppComponent.ngOnInit");
    if (!this.appSvc.isLogin()) {
      this.router.navigate(["login"]);
    }
  }
}
