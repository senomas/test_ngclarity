import { Component, OnInit, OnDestroy, Input } from '@angular/core'

import { FormGroup } from "@angular/forms"

@Component({
  selector: 'app-generic-edit-input',
  templateUrl: './generic-edit-input.component.html',
  styleUrls: ['./generic-edit-input.component.scss']
})
export class GenericEditInputComponent implements OnInit {

  @Input()
  formGroup: FormGroup

  @Input()
  public item: any

  @Input()
  public masters: any

  public checked = {}

  private subs: any

  constructor() { }

  ngOnInit() {
    if (this.item.type === "checkboxes") {
      this.subs = this.item.fcontrol.valueChanges.subscribe(v => {
        this.checked = {}
        if (v) {
          v.forEach(n => {
            this.checked[n] = true
          })
        }
      })
    }
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe()
    }
  }

  checkboxToggle(id) {
    console.log(`checkboxToggle("${id}")`)
    this.checked[id] = !this.checked[id]
    let v = []
    for (let k in this.checked) {
      if (this.checked[k]) {
        v.push(k)
      }
    }
    this.item.fcontrol.setValue(v)
  }
}
