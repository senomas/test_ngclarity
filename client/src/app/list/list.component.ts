import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";

import * as moment from "moment";

import { AppService, Repository, State } from "../app.service";
import { User } from "../models/user.model";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit {
  @Input("ui") ui;

  fields: any[];

  repo: Repository<any>;

  items: any[] = [];

  selected: any[] = [];

  state: State = {};

  total = 0;

  constructor(private appSvc: AppService, private router: Router) {}

  ngOnInit() {
    this.repo = this.appSvc[`${this.ui.id}Repo`] as Repository<any>;
    this.fields = [];
    this.ui.fields.forEach((v: any) => {
      if (v.control && !v.detailOnly) {
        this.fields.push({
          id: v.id,
          label: v.label,
          format: v.control.format
        });
      } else if (v.controls) {
        v.controls.forEach((u: any) => {
          if (!u.detailOnly) {
            this.fields.push({
              id: u.id,
              label: u.label,
              format: u.control.format
            });
          }
        });
      }
    });
  }

  onClearSelection() {
    this.selected = [];
  }

  onAdd() {
    this.router.navigate([`${this.ui.id}-new`]);
  }

  onEdit() {
    if (this.selected.length == 1) {
      this.router.navigate([`${this.ui.id}/${this.selected[0]}`]);
    }
  }

  onDelete() {
    this.repo
      .delete(this.selected)
      .then(v => {
        console.log("Delete results", v);
        this.selected = [];
        this.refresh(this.state);
      })
      .catch(err => {
        if (err.statusText) {
          this.appSvc.showWarning(err.statusText);
        } else {
          this.appSvc.showWarning("Unknown error");
        }
      });
  }

  refresh(state: State) {
    this.state = state;
    this.repo
      .list(state)
      .then(v => {
        this.items = v.list;
        this.total = v.total;
      })
      .catch(err => {
        if (err.statusText) {
          this.appSvc.showWarning(err.statusText);
        } else {
          this.appSvc.showWarning("Unknown error");
        }
      });
  }
}
