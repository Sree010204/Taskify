import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStatusComponent } from './new-status.component';

describe('NewStatusComponent', () => {
  let component: NewStatusComponent;
  let fixture: ComponentFixture<NewStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewStatusComponent]
    });
    fixture = TestBed.createComponent(NewStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
