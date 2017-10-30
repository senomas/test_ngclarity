import { Component, OnInit, Input } from '@angular/core';

import { FormGroup } from "@angular/forms";

@Component({
  selector: 'app-generic-edit-input',
  templateUrl: './generic-edit-input.component.html',
  styleUrls: ['./generic-edit-input.component.scss']
})
export class GenericEditInputComponent implements OnInit {

  @Input()
  formGroup: FormGroup;

  @Input()
  public item: any;

  constructor() { }

  ngOnInit() {
  }

}
