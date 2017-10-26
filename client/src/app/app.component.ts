import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

import { AppService } from "./app.service";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
  collapsible = true;

  private _collapse: boolean = true;

  private user: any = {};

  private loginFailed: boolean = false;

  items: any[] = [
    { id: "home", label: "Home" },
    { id: "user", label: "User" },
    { id: "role", label: "Role" },
    { id: "product", label: "Product" },
    { id: "address", label: "Address" },
    { id: "blog", label: "Blog" },
    { id: "info", label: "Info" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
    { id: "params", label: "Params" }
  ];

  constructor(private router: Router, public appSvc: AppService) { }

  ngOnInit() {
    console.log(`AppComponent.ngOnInit "${this.router.url}" "${JSON.stringify(this.appSvc.tokens)}"`);
  }

  ngOnDestroy() {
    console.log("AppComponent.ngOnDestroy");
  }

  get needLogin(): boolean {
    return !this.appSvc.tokens || !this.appSvc.user;
  }

  async login() {
    try {
      this.loginFailed = false;
      await this.appSvc.login(this.user);
      this.user.password = null;
    } catch (err) {
      console.log("Error login", err);
      this.loginFailed = true;
      this.user.password = null;
    }
  }

  logout() {
    this.appSvc.logout();
    this._collapse = true;
  }

  get collapse(): boolean {
    return this._collapse;
  }

  set collapse(value: boolean) {
    this._collapse = value;
  }

  toggleCollapsible(): void {
    this.collapsible = !this.collapsible;
  }

  toggleCollapse(): void {
    this.collapse = !this.collapse;
  }
}
