import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChart } from './donut-chart';

describe('PieChart', () => {
  let component: PieChart;
  let fixture: ComponentFixture<PieChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PieChart],
    }).compileComponents();

    fixture = TestBed.createComponent(PieChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
