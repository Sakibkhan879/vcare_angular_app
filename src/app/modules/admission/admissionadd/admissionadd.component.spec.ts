import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionaddComponent } from './admissionadd.component';

describe('AdmissionaddComponent', () => {
  let component: AdmissionaddComponent;
  let fixture: ComponentFixture<AdmissionaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmissionaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissionaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
