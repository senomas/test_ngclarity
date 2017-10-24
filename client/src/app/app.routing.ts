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
import { InfoComponent } from "./info/info.component";

import { GenericListComponent } from "./generic-list/generic-list.component";
import { GenericEditComponent } from "./generic-edit/generic-edit.component";

import { UserView } from "./models/user.model";
import { ProductView } from "./models/product.model";
import { AddressView } from "./models/address.model";
import { BlogView } from "./models/blog.model";

export const ROUTES: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "about", component: AboutComponent },
  { path: "login", component: LoginComponent },
  { path: "info", component: InfoComponent },
  {
    path: "user",
    component: GenericListComponent,
    data: { ui: UserView }
  },
  { path: "user/:id", component: GenericEditComponent, data: { ui: UserView } },
  { path: "user-new", component: GenericEditComponent, data: { ui: UserView } },
  {
    path: "product",
    component: GenericListComponent,
    data: { ui: ProductView }
  },
  {
    path: "product/:id",
    component: GenericEditComponent,
    data: { ui: ProductView }
  },
  {
    path: "product-new",
    component: GenericEditComponent,
    data: { ui: ProductView }
  },
  {
    path: "address",
    component: GenericListComponent,
    data: { ui: AddressView }
  },
  {
    path: "address/:id",
    component: GenericEditComponent,
    data: { ui: AddressView }
  },
  {
    path: "address-new",
    component: GenericEditComponent,
    data: { ui: AddressView }
  },
  {
    path: "blog",
    component: GenericListComponent,
    data: { ui: BlogView }
  },
  {
    path: "blog/:id",
    component: GenericEditComponent,
    data: { ui: BlogView }
  },
  {
    path: "blog-new",
    component: GenericEditComponent,
    data: { ui: BlogView }
  }
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES);
