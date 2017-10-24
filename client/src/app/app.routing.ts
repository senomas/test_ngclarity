import { ModuleWithProviders } from "@angular/core/src/metadata/ng_module";
import { Routes, RouterModule } from "@angular/router";

import { AboutComponent } from "./about/about.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";

import { GenericListComponent } from "./generic-list/generic-list.component";
import { GenericEditComponent } from "./generic-edit/generic-edit.component";

import { UserView } from "./models/user.model";
import { ProductView } from "./models/product.model";
import { ParamsView } from "./models/params.model";

export const ROUTES: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "about", component: AboutComponent },
  { path: "login", component: LoginComponent },
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
    path: "params",
    component: GenericListComponent,
    data: { ui: ParamsView }
  },
  {
    path: "params/:id",
    component: GenericEditComponent,
    data: { ui: ParamsView }
  },
  {
    path: "params-new",
    component: GenericEditComponent,
    data: { ui: ParamsView }
  }
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES);
