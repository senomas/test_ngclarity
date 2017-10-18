import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { AppService } from "./app.service";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(private router: Router, public appSvc: AppService) {}

  ngOnInit() {
    console.log("AppComponent.ngOnInit");
  }
}
