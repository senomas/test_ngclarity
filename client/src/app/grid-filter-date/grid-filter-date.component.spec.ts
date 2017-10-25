import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridFilterDateComponent } from './grid-filter-date.component';

describe('GridFilterDateComponent', () => {
  let component: GridFilterDateComponent;
  let fixture: ComponentFixture<GridFilterDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridFilterDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridFilterDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
