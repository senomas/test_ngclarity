import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn
} from "@angular/forms";

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent implements OnInit {

  formGroup: FormGroup;

  access: any[] = [{
    id: "user",
    create: true, read: true, update: true, delete: true
  }, {
    id: "role",
    create: true, read: true, update: true, delete: true
  }, {
    id: "params",
    read: true, update: true
  }];

  actions: any[] = ["backflip", "jump-overboard"]

  constructor() {
  }

  ngOnInit() {
  }

}
