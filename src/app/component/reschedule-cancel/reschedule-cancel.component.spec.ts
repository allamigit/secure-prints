import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescheduleCancelComponent } from './reschedule-cancel.component';

describe('RescheduleCancelComponent', () => {
  let component: RescheduleCancelComponent;
  let fixture: ComponentFixture<RescheduleCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RescheduleCancelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RescheduleCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
