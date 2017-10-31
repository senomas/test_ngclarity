import { ModuleWithProviders } from "@angular/core/src/metadata/ng_module"
import { Routes, RouterModule } from "@angular/router"

import { AboutComponent } from "./about/about.component"
import { HomeComponent } from "./home/home.component"

import { GenericListComponent } from "./generic-list/generic-list.component"
import { GenericEditComponent } from "./generic-edit/generic-edit.component"

import { RoleEditComponent } from "./role-edit/role-edit.component"

import { MODELS_ROUTES } from "./models/models.type"

export const ROUTES: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "about", component: AboutComponent },
  { path: "role/:id", component: RoleEditComponent },
  { path: "role-new", component: RoleEditComponent },
  ...MODELS_ROUTES
]

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES)
