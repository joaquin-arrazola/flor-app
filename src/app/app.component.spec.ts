import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the FlorApp client portal', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize with WEEKLY subscription cadence by default', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.catalog.selectedFrequency()).toBe('WEEKLY');
  });

  it('should switch between WEEKLY and MONTHLY cadences and recalculate discounts', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.selectFrequency('WEEKLY');
    expect(app.catalog.currentFrequency().discountPercent).toBe(15);

    app.selectFrequency('MONTHLY');
    expect(app.catalog.currentFrequency().discountPercent).toBe(0);
  });
});
