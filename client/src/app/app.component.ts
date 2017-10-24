import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { AppService } from "./app.service";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  collapsible = true;

  private _collapse: boolean = true;

  items: any[] = [
    { id: "home", label: "Home" },
    { id: "user", label: "User" },
    { id: "product", label: "Product" },
    { id: "address", label: "Address" },
    { id: "blog", label: "Blog" },
    { id: "info", label: "Info" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
    { id: "params", label: "Params" }
  ];

  constructor(private router: Router, public appSvc: AppService) {}

  ngOnInit() {
    console.log("AppComponent.ngOnInit");
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
