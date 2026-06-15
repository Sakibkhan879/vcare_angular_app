import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DummydashboardlistComponent } from './dummydashboardlist.component';

describe('DummydashboardlistComponent', () => {
  let component: DummydashboardlistComponent;
  let fixture: ComponentFixture<DummydashboardlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DummydashboardlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DummydashboardlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
