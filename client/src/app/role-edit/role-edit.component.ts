import { Component, OnInit, OnDestroy } from "@angular/core"
import { Location } from "@angular/common"
import { Router, ActivatedRoute } from "@angular/router"
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn
} from "@angular/forms"

import { AppService, Repository, State } from "../app.service"

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent implements OnInit {

  item: any = {}

  access: any[] = [{
    id: "user",
    create: true, read: true, update: true, delete: true
  }, {
    id: "role",
    create: true, read: true, update: true, delete: true
  }, {
    id: "params",
    read: true, update: true
  }]

  permissions: any[] = []

  actions: any[] = ["backflip", "jump-overboard"]

  constructor(private appSvc: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit() {
    this.permissions = await this.appSvc.getPermissions()
  }

}
