import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { ClarityModule } from "clarity-angular";
import { AppComponent } from "./app.component";
import { ROUTING } from "./app.routing";
import { AppService } from "./app.service";
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { GenericListComponent } from "./generic-list/generic-list.component";
import { GenericEditComponent } from "./generic-edit/generic-edit.component";
import { GridFilterDateComponent } from './grid-filter-date/grid-filter-date.component';
import { RoleEditComponent } from './role-edit/role-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    GenericListComponent,
    GenericEditComponent,
    GridFilterDateComponent,
    RoleEditComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ClarityModule,
    ROUTING
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
