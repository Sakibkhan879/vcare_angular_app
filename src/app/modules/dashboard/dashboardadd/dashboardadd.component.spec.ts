import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardaddComponent } from './dashboardadd.component';

describe('DashboardaddComponent', () => {
  let component: DashboardaddComponent;
  let fixture: ComponentFixture<DashboardaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
