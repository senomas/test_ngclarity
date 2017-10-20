/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ModuleWithProviders } from "@angular/core/src/metadata/ng_module";
import { Routes, RouterModule } from "@angular/router";

import { AboutComponent } from "./about/about.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";

import { GenericListComponent } from "./generic-list/generic-list.component";
import { GenericEditComponent } from "./generic-edit/generic-edit.component";

import { User_UI } from "./models/user.model";
import { Product_UI } from "./models/product.model";

export const ROUTES: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "about", component: AboutComponent },
  { path: "login", component: LoginComponent },
  {
    path: "user",
    component: GenericListComponent,
    data: { ui: User_UI }
  },
  { path: "user/:id", component: GenericEditComponent, data: { ui: User_UI } },
  { path: "user-new", component: GenericEditComponent, data: { ui: User_UI } },
  {
    path: "product",
    component: GenericListComponent,
    data: { ui: Product_UI }
  },
  {
    path: "product/:id",
    component: GenericEditComponent,
    data: { ui: Product_UI }
  },
  {
    path: "product-new",
    component: GenericEditComponent,
    data: { ui: Product_UI }
  }
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES);
