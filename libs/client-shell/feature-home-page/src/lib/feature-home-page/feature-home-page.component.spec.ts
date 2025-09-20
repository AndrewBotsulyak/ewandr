import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureHomePageComponent } from './feature-home-page.component';

describe('FeatureHomePageComponent', () => {
  let component: FeatureHomePageComponent;
  let fixture: ComponentFixture<FeatureHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureHomePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
