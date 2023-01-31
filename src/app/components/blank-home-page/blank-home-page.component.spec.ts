import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlankHomePageComponent } from './blank-home-page.component';

describe('BlankHomePageComponent', () => {
  let component: BlankHomePageComponent;
  let fixture: ComponentFixture<BlankHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlankHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlankHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
