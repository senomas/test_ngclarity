import { Component, OnInit, OnDestroy } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn
} from "@angular/forms";

import { AppService, Repository, State } from "../app.service";

import * as moment from "moment";

@Component({
  selector: "app-edit",
  templateUrl: "./generic-edit.component.html",
  styleUrls: ["./generic-edit.component.scss"]
})
export class GenericEditComponent implements OnInit {
  repo: Repository<any>;

  item: any;
  itemLoaded: boolean = false;

  ui;

  forms = [];

  formGroup: FormGroup;

  constructor(
    private appSvc: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    console.log("GenericEditComponent.ngOnInit");
    this.itemLoaded = false;
    let fb = {};
    this.route.data.first().subscribe(v => {
      console.log("GenericEdit", v);
      this.ui = v.ui;
      this.ui.edit.forEach((_v: any) => {
        if (typeof _v === "object") {
          let v = Object.create(_v);
          this.forms.push(v);
          fb[v.id] = v.fcontrol = this.createFormControl(v);
        } else {
          console.log("UNKNOWN TYPE", typeof _v, _v);
        }
      });
      this.formGroup = this.formBuilder.group(fb);
      this.repo = this.appSvc[`${this.ui.id}Repo`];
      this.route.params.subscribe(param => {
        if (param.id) {
          this.repo
            .get(param.id)
            .then(_v => {
              console.log("RESULT", _v);
              this.item = _v;
              let v = {};
              this.forms.forEach((f: any) => {
                if (typeof f === "object") {
                  let _vf = this.getValue(f.id, _v);
                  if (f.format) {
                    v[f.id] = f.control.format(_vf);
                  } else if (f.type === "date") {
                    v[f.id] = moment(_vf).format("YYYY-MM-DD");
                  } else if (!f.type && f.schema && f.schema.type === "Date") {
                    f.type = "date";
                    v[f.id] = moment(_vf).format("YYYY-MM-DD");
                  } else {
                    v[f.id] = _vf;
                  }
                }
              });
              console.log("VALUE", v);
              this.formGroup.setValue(v);
              this.itemLoaded = true;
            })
            .catch(err => {
              console.log("ERROR", err);
              this.router.navigate(["user"]);
            });
        } else {
          this.item = {};
          let v = {};
          this.forms.forEach((f: any) => {
            if (typeof f === "object") {
              v[f.id] = null;
            }
          });
          console.log("VALUE", v);
          this.formGroup.setValue(v);
          this.itemLoaded = true;
        }
      });
    });
  }

  getValue(keys: string, v: any): any {
    let res: any = v;
    keys.split(".").forEach(k => {
      res = res[k];
      if (!res) return null;
    })
    return res;
  }

  setValue(keys: string, data: any, value: any) {
    let kx = keys.split(".");
    let pd: any = data;
    kx.slice(0, -1).forEach(k => {
      if (!pd[k]) {
        pd[k] = {};
      }
      pd = pd[k];
    });
    let pkl = kx.slice(-1)[0];
    pd[pkl] = value;
  }

  ngOnDestroy() {
    console.log("GenericEditComponent.ngOnDestroy");
  }

  createFormControl(fc): FormControl {
    let validators: ValidatorFn[] = [];
    for (let v in fc.validator) {
      switch (v) {
        case "required":
          validators.push(Validators.required);
          break;
        case "maxLength":
          validators.push(Validators.maxLength(fc.validator[v]));
          break;
        case "minLength":
          validators.push(Validators.minLength(fc.validator[v]));
          break;
        case "email":
          validators.push(Validators.email);
          break;
        default:
          console.warn("Unsupported validator", v);
      }
    }
    return new FormControl(null, validators);
  }

  onSubmit() {
    let v = this.formGroup.value;
    this.forms.forEach((f: any) => {
      if (typeof f === "object") {
        let val = v[f.id];
        if (f.parse) {
          val = f.parse(val);
        } else if (f.type === "date") {
          val = moment(val, "YYYY-MM-DD").toDate();
        } else if (!f.type && f.schema && f.schema.type === "Date") {
          val = moment(val, "YYYY-MM-DD").toDate();
        }
        this.setValue(f.id, this.item, val);
      }
    });
    console.log("SAVE", this.item);
    if (this.item._id) {
      this.repo
        .update(this.item)
        .then(v => {
          this.location.back();
        })
        .catch(err => {
          console.log("Error update", this.ui.label, err, this.item);
          this.appSvc.showWarning(err);
        });
    } else {
      this.repo
        .save(this.item)
        .then(v => {
          this.location.back();
        })
        .catch(err => {
          console.log("Error save", this.ui.label, err, this.item);
          this.appSvc.showWarning(err);
        });
    }
  }

  onBack() {
    this.location.back();
  }
}
