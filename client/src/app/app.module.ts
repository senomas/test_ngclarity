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
import { LoginComponent } from "./login/login.component";
import { UserListComponent } from "./user-list/user-list.component";
import { UserEditComponent } from "./user-edit/user-edit.component";
import { ProductListComponent } from "./product-list/product-list.component";
import { ListComponent } from "./list/list.component";
import { EditComponent } from './edit/edit.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { GenericListComponent } from './generic-list/generic-list.component';
import { GenericEditComponent } from './generic-edit/generic-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    LoginComponent,
    UserListComponent,
    UserEditComponent,
    ProductListComponent,
    ListComponent,
    EditComponent,
    ProductEditComponent,
    GenericListComponent,
    GenericEditComponent
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
export class AppModule {}
