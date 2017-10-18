import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { AppService, Repository, State } from "../app.service";

@Injectable()
export class ListComponent<T> {
  repo: Repository<T>;

  items: T[] = [];

  selected: T[] = [];

  state: State = {};

  total = 0;

  warning: any;

  constructor(
    private repoId: string,
    private appSvc: AppService,
    private router: Router
  ) {
    this.repo = this.appSvc[`${repoId}Repo`] as Repository<T>;
  }

  onClearSelection() {
    this.selected = [];
  }

  onAdd() {
    this.router.navigate([`${this.repoId}-new`]);
  }

  onEdit() {
    if (this.selected.length == 1) {
      let id = (this.selected[0] as any)._id;
      this.router.navigate([`${this.repoId}/${id}`]);
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
          this.warning = err.statusText;
        } else {
          this.warning = "Unknown error";
        }
      });
  }

  clearWarning() {
    this.warning = undefined;
  }

  refresh(state: State) {
    this.state = state;
    this.repo
      .list(state)
      .then(v => {
        this.items = v.list as T[];
        this.total = v.total;
      })
      .catch(err => {
        if (err.statusText) {
          this.warning = err.statusText;
        } else {
          this.warning = "Unknown error";
        }
      });
  }

  dump() {
    console.log("PAG", this.state);
  }
}
