import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleSvgComponent } from './people-svg.component';

describe('PeopleSvgComponent', () => {
  let component: PeopleSvgComponent;
  let fixture: ComponentFixture<PeopleSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeopleSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
