import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffortChart } from './effort-chart';

describe('EffortChart', () => {
  let component: EffortChart;
  let fixture: ComponentFixture<EffortChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EffortChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EffortChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
