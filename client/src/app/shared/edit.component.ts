import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";

import { AppService, Repository, State } from "../app.service";

export class EditComponent<T> {
  repo: Repository<T>;

  item: T = {} as T;

  warning: any;

  constructor(
    private repoId: string,
    private appSvc: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.repo = this.appSvc[`${repoId}Repo`] as Repository<T>;
    this.route.params.subscribe(param => {
      if (param.id) {
        this.repo
          .get(param.id)
          .then(v => {
            console.log("USER", v);
            this.item = v;
          })
          .catch(err => {
            console.log("ERROR", err);
            this.router.navigate([repoId]);
          });
      } else {
        this.item = {} as T;
      }
    });
  }

  onSubmit() {
    if ((this.item as any)._id) {
      this.repo
        .update(this.item)
        .then(() => this.onBack())
        .catch(err => {
          if (err.statusText) {
            this.warning = err.statusText;
          } else {
            this.warning = "Unknown error";
          }
        });
    } else {
      this.repo
        .save(this.item)
        .then(() => this.onBack())
        .catch(err => {
          if (err.statusText) {
            this.warning = err.statusText;
          } else {
            this.warning = "Unknown error";
          }
        });
    }
  }

  clearWarning() {
    this.warning = undefined;
  }

  onBack() {
    this.location.back();
  }
}
