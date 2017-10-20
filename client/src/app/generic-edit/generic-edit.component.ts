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
  ) {}

  ngOnInit() {
    console.log("GenericEditComponent.ngOnInit");
    this.itemLoaded = false;
    let fb = {};
    this.route.data.first().subscribe(v => {
      console.log("GenericEdit", v);
      this.ui = v.ui;
      this.ui.fields.forEach((_v: any) => {
        if (_v.control) {
          let v = Object.create(_v);
          this.forms.push(v);
          fb[v.id] = v.fcontrol = this.createFormControl(v.control);
        } else if (_v.controls) {
          let v = Object.create(_v);
          v.controls = [];
          _v.controls.forEach((_u: any) => {
            let u = Object.create(_u);
            v.controls.push(u);
            fb[u.id] = u.fcontrol = this.createFormControl(u.control);
          });
          this.forms.push(v);
        }
      });
      this.formGroup = this.formBuilder.group(fb);
      this.repo = this.appSvc[`${this.ui.id}Repo`];
      this.route.params.subscribe(param => {
        if (param.id) {
          this.repo
            .get(param.id)
            .then(_v => {
              this.item = _v;
              let v = {};
              this.forms.forEach((f: any) => {
                if (f.control) {
                  if (f.control.format) {
                    v[f.id] = f.control.format(_v[f.id]);
                  } else {
                    v[f.id] = _v[f.id];
                  }
                } else if (f.controls) {
                  f.controls.forEach((fc: any) => {
                    if (fc.control.format) {
                      v[fc.id] = f.control.format(_v[fc.id]);
                    } else {
                      v[fc.id] = _v[fc.id];
                    }
                  });
                }
              });
              this.formGroup.setValue(v);
              this.itemLoaded = true;
            })
            .catch(err => {
              console.log("ERROR", err);
              // this.router.navigate(["user"]);
            });
        } else {
          this.item = {};
          this.formGroup.setValue(this.item);
        }
      });
    });
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
      if (f.control) {
        if (f.control.parse) {
          this.item[f.id] = f.control.parse(v[f.id]);
        } else {
          this.item[f.id] = v[f.id];
        }
      } else if (f.controls) {
        f.controls.forEach((fc: any) => {
          if (fc.control.parse) {
            this.item[fc.id] = f.control.parse(v[fc.id]);
          } else {
            this.item[fc.id] = v[fc.id];
          }
        });
      }
    });
    // TODO SAVE
  }

  onBack() {
    this.location.back();
  }
}
