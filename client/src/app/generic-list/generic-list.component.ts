import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { AppService, Repository, State } from "../app.service";

import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/first";

@Component({
  selector: "app-generic-list",
  templateUrl: "./generic-list.component.html",
  styleUrls: ["./generic-list.component.scss"]
})
export class GenericListComponent implements OnInit, OnDestroy {
  ui: any;

  fields: any[];

  repo: Repository<any>;

  items: any[] = [];

  selected: any[] = [];

  state: State = {};

  total = 0;

  constructor(
    private appSvc: AppService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log("GenericListComponent.ngOnInit");
    this.route.data.first().subscribe(v => {
      console.log("GenericList", v);
      this.ui = v.ui;
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
    });
  }

  ngOnDestroy() {
    console.log("GenericListComponent.ngOnDestroy");
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
