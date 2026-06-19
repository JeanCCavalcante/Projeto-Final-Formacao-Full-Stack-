import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhythmChart } from './rhythm-chart';

describe('RhythmChart', () => {
  let component: RhythmChart;
  let fixture: ComponentFixture<RhythmChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RhythmChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RhythmChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
