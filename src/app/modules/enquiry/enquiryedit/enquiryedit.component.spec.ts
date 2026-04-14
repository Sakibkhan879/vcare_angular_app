import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryeditComponent } from './enquiryedit.component';

describe('EnquiryeditComponent', () => {
  let component: EnquiryeditComponent;
  let fixture: ComponentFixture<EnquiryeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiryeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiryeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
