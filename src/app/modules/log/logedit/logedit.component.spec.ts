import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogeditComponent } from './logedit.component';

describe('LogeditComponent', () => {
  let component: LogeditComponent;
  let fixture: ComponentFixture<LogeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
