import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogaddComponent } from './logadd.component';

describe('LogaddComponent', () => {
  let component: LogaddComponent;
  let fixture: ComponentFixture<LogaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
