import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericEditInputComponent } from './generic-edit-input.component';

describe('GenericEditInputComponent', () => {
  let component: GenericEditInputComponent;
  let fixture: ComponentFixture<GenericEditInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericEditInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericEditInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
