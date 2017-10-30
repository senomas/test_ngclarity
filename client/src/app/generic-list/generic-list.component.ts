import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { AppService, Repository, State } from "../app.service";

import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/first";
import * as moment from "moment";

@Component({
  selector: "app-generic-list",
  templateUrl: "./generic-list.component.html",
  styleUrls: ["./generic-list.component.scss"]
})
export class GenericListComponent implements OnInit, OnDestroy {
  ui: any;

  repo: Repository<any>;

  items: any[] = [];

  selected: any[] = [];

  state: State = {};

  total = 0;

  constructor(
    private appSvc: AppService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.appSvc.loading = true;
    console.log("GenericListComponent.ngOnInit");
    this.route.data.first().subscribe(v => {
      console.log("GenericList", v);
      this.ui = v.ui;
      this.repo = this.appSvc[`${this.ui.id}Repo`] as Repository<any>;
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
      .catch(err => this.handleError(err));
  }

  async refresh(state: State) {
    try {
      this.appSvc.loading = true
      this.state = state
      let v = await this.repo.list(state)
      this.items = v.list
      this.total = v.total
      this.appSvc.loading = false
    } catch (err) {
      this.handleError(err)
      this.appSvc.loading = false
    }
  }

  getValue(f: any, v: any): any {
    let res: any = v;
    f.id.split(".").forEach(k => {
      res = res[k];
      if (!res) return null;
    })
    if (f.format) {
      res = f.format(res);
    } else if (f.type === "date") {
      res = moment(res).format("DD/MM/YYYY");
    } else if (!f.type && f.$model && f.$model.type === "Date") {
      res = moment(res).format("DD/MM/YYYY");
    }
    return res;
  }

  handleError(err) {
    if (err._body) {
      let ebody = JSON.parse(err._body);
      if (ebody.message) {
        this.appSvc.showWarning(ebody.message);
        return
      }
    }
    console.log("APP ERR", err);
    this.appSvc.showWarning("Unknown error");
  }
}
