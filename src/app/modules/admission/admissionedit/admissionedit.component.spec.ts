import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissioneditComponent } from './admissionedit.component';

describe('AdmissioneditComponent', () => {
  let component: AdmissioneditComponent;
  let fixture: ComponentFixture<AdmissioneditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmissioneditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissioneditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
