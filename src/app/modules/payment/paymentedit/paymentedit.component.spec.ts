import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymenteditComponent } from './paymentedit.component';

describe('PaymenteditComponent', () => {
  let component: PaymenteditComponent;
  let fixture: ComponentFixture<PaymenteditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymenteditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymenteditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
