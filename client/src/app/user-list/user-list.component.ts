import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AppService, User, State } from "../app.service";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"]
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  selected: any[] = [];

  total = 0;

  constructor(private appSvc: AppService, private router: Router) {}

  ngOnInit() {}

  onClearSelection() {
    this.selected = [];
  }

  onAdd() {
    this.router.navigate(["user-new"]);
  }

  onEdit() {
    if (this.selected.length == 1) {
      console.log("SELECTED", this.selected);
      this.router.navigate([`user/${this.selected[0]._id}`]);
    }
  }

  refresh(state: State) {
    console.log("refresh", JSON.stringify(state));
    this.appSvc
      .getUsers(state)
      .then(v => {
        this.users = v.list;
        this.total = v.total;
      })
      .catch(err => console.log("loadUser error", err));
  }
}
