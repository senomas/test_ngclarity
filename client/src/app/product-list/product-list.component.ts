import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AppService, State } from "../app.service";
import { ListComponent } from "../shared/list.component";
import { Product } from "../models/product.model";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"]
})
export class ProductListComponent extends ListComponent<Product>
  implements OnInit {
  constructor(appSvc: AppService, router: Router) {
    super("product", appSvc, router);
  }

  ngOnInit() {}
}
