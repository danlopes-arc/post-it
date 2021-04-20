import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompassSvgComponent } from './compass-svg.component';

describe('CompassSvgComponent', () => {
  let component: CompassSvgComponent;
  let fixture: ComponentFixture<CompassSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompassSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompassSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
