import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BciBackgroundComponent } from './bci-background.component';

describe('BciBackgroundComponent', () => {
  let component: BciBackgroundComponent;
  let fixture: ComponentFixture<BciBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BciBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BciBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
