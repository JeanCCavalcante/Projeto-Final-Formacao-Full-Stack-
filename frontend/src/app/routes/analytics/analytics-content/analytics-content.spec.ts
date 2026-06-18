import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsContent } from './analytics-content';

describe('AnalyticsContent', () => {
  let component: AnalyticsContent;
  let fixture: ComponentFixture<AnalyticsContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalyticsContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsContent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
