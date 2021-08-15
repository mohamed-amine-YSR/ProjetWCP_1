import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemesComponent } from './problemes.component';

describe('ProblemesComponent', () => {
  let component: ProblemesComponent;
  let fixture: ComponentFixture<ProblemesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProblemesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
