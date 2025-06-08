import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FbiBackgroundComponent } from './fbi-background.component';

describe('FbiBackgroundComponent', () => {
  let component: FbiBackgroundComponent;
  let fixture: ComponentFixture<FbiBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FbiBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FbiBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
