import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AppService, State } from "../app.service";
import { Product, Product_UI } from "../models/product.model";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"]
})
export class ProductListComponent implements OnInit {
  ui = Product_UI;

  ngOnInit() {}
}
